import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendChatMessage } from "../../api/chatbot";
import { useAuth } from "../../api/AuthContext";
import { 
  collection, 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "../../api/firebaseConfig";

// Define message type
type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp?: Timestamp | Date;
};

// Define conversation type stored in Firestore
type Conversation = {
  userId: string;
  lastUpdated: Timestamp;
  messages: {
    text: string;
    isUser: boolean;
    timestamp: Timestamp | Date;
    id: string;
  }[];
}

export default function ChatBot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Fetch chat history when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchChatHistory();
    } else {
      // Reset to initial state if no user is logged in
      setMessages([
        {
          id: "welcome",
          text: "Hello! I'm your AI assistant. How can I help you today?",
          isUser: false,
        },
      ]);
      setIsHistoryLoading(false);
    }
  }, [user?.uid]);

  // Fetch chat history from Firestore
  const fetchChatHistory = async () => {
    if (!user) return;
    
    setIsHistoryLoading(true);
    
    try {
      console.log("Fetching chat history for user:", user.uid);
      
      // Reference to the user's conversation document
      const conversationRef = doc(db, "conversations", user.uid);
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) {
        console.log("No previous chat history found");
        setMessages([
          {
            id: "welcome",
            text: "Hello! I'm your AI assistant. How can I help you today?",
            isUser: false,
          },
        ]);
      } else {
        const conversationData = conversationDoc.data() as Conversation;
        console.log("Found chat history:", conversationData.messages.length, "messages");
        
        if (conversationData.messages && conversationData.messages.length > 0) {
          setMessages(conversationData.messages);
        } else {
          setMessages([
            {
              id: "welcome",
              text: "Hello! I'm your AI assistant. How can I help you today?",
              isUser: false,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Save message to Firestore
  const saveMessageToFirestore = async (message: Omit<Message, "id">) => {
    if (!user) {
      console.warn("Cannot save message: No user is logged in");
      return null;
    }
    
    try {
      // Generate a unique ID for the message
      const messageId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Create the message object with ID and timestamp
      const messageWithId = {
        ...message,
        id: messageId,
        timestamp: new Date(), // Use client-side date for immediate display
      };
      
      // Reference to the user's conversation document
      const conversationRef = doc(db, "conversations", user.uid);
      
      // Check if conversation document exists
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) {
        // Create new conversation document if it doesn't exist
        await setDoc(conversationRef, {
          userId: user.uid,
          lastUpdated: serverTimestamp(),
          messages: [messageWithId]
        });
      } else {
        // Update existing conversation document
        await updateDoc(conversationRef, {
          lastUpdated: serverTimestamp(),
          messages: arrayUnion(messageWithId)
        });
      }
      
      console.log("Message saved with ID:", messageId);
      return messageId;
    } catch (error) {
      console.error("Error saving message:", error);
      return null;
    }
  };

  // Debug response
  const debugResponse = async (message: string) => {
    try {
      console.log("Sending message to API:", message);
      const response = await sendChatMessage(message);
      console.log("Received response:", response);
      return response;
    } catch (error) {
      console.error("API Error details:", error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    
    // Create the user message object without ID (will be assigned in saveMessageToFirestore)
    const userMessage: Omit<Message, "id"> = {
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    // Generate a temporary ID for local display
    const tempUserMessage = {
      ...userMessage,
      id: `temp-user-${Date.now().toString()}`,
    };
    
    // Add user message to the chat locally (for immediate display)
    setMessages((prevMessages) => [...prevMessages, tempUserMessage]);
    
    // Clear input field
    setInput("");
    
    // Show loading indicator
    setIsLoading(true);
    
    try {
      // Save user message to Firestore and get the assigned ID
      const userMessageId = await saveMessageToFirestore(userMessage);
      
      // Get chatbot response with debugging
      const response = await debugResponse(messageText);
      
      // Create bot response
      const botMessage: Omit<Message, "id"> = {
        text: response || "I don't have a response for that.",
        isUser: false,
        timestamp: new Date(),
      };
      
      // Save bot response to Firestore
      await saveMessageToFirestore(botMessage);
      
      // Add bot response to chat locally
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...botMessage,
          id: `temp-bot-${Date.now().toString()}`,
        },
      ]);
      
      // Refresh the entire chat history to ensure we have the latest data with proper IDs
      if (user) {
        fetchChatHistory();
      }
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      
      const errorMessage: Omit<Message, "id"> = {
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      
      // Save error message to Firestore
      await saveMessageToFirestore(errorMessage);
      
      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...errorMessage,
          id: `error-${Date.now().toString()}`,
        },
      ]);
    } finally {
      setIsLoading(false);
      
      // Scroll to the bottom after adding new messages
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Chatbot Heading */}
      <Text style={styles.heading}>ChatBot Assistant</Text>

      {isHistoryLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#429D7E" />
          <Text style={styles.loadingText}>Loading chat history...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View 
              style={[
                styles.messageBubble, 
                item.isUser ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text 
                style={[
                  styles.messageText, 
                  !item.isUser && styles.botMessageText
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#429D7E" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={user ? "Type a message" : "Sign in to chat"}
            placeholderTextColor="#B0BEC5"
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            editable={!!user}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              (!input.trim() || isLoading || !user) && styles.disabledButton
            ]} 
            onPress={handleSend}
            disabled={isLoading || !input.trim() || !user}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F1F8E9",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 10,
    paddingVertical: 10,
  },
  messageList: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    maxWidth: "75%",
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessage: {
    backgroundColor: "#429D7E",
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
  },
  botMessage: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#FFFFFF", // For user messages
  },
  botMessageText: {
    color: "#333333", // Override for bot messages
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginBottom: 10,
    marginTop: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: "#429D7E",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#AACFC4",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    flex: 1,
  },
  loadingText: {
    marginLeft: 8,
    color: "#429D7E",
    fontSize: 14,
  },
});
