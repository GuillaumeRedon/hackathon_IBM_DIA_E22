"use client"
 
import { useState } from "react"

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}
 
type ChatProps = {
  initialMessages?: Message[]
}
 
export function ChatBot(props: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(props.initialMessages || [])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    ''
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Réponse simulée du modèle pour: "${input}"`
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const suggestions = [
    "What is the weather in San Francisco?",
    "Explain step-by-step how to solve this math problem: If x² + 6x + 9 = 25, what is x?",
    "Design a simple algorithm to find the longest palindrome in a string.",
  ]
 
  return (
    <div className="flex flex-col h-[500px] w-full"> 
      <div 
        className="flex flex-col flex-1 border border-gray-200 rounded-xl bg-white"
        style={{
          boxShadow: '0px 0px 20px 0px rgba(76, 87, 125, 0.02)'
        }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center mt-8">
              <h3 className="strong-blue font-semibold text-lg mb-4">Commencez une conversation avec l'IA</h3>
              <div className="space-y-3">
                <p className="text-sm strong-blue font-medium">Suggestions:</p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="block w-full text-left p-3 text-sm grey-button hover:bg-purple-accent hover:text-white rounded-lg transition-all duration-200 strong-blue"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-purple-accent text-white'
                    : 'grey-button strong-blue'
                }`}
                style={{
                  boxShadow: message.role === 'assistant' ? '0px 0px 10px 0px rgba(76, 87, 125, 0.08)' : 'none'
                }}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div 
                className="grey-button p-4 rounded-xl"
                style={{
                  boxShadow: '0px 0px 10px 0px rgba(76, 87, 125, 0.08)'
                }}
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-accent rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-100 p-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-accent focus:border-transparent transition-all duration-200"
              style={{
                boxShadow: '0px 0px 10px 0px rgba(76, 87, 125, 0.05)'
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-purple-accent text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}