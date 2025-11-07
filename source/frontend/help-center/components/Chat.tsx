"use client"
 
import { useState, useEffect, useRef } from "react"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

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
    "Comment justifier une absence si je suis alternant ?",
    "Que ce passe t-il si je ne valide pas un module ?",
    "Quelles sont les démarches à faire pour un stage en entreprise ?",
  ]
 
  return (
    <div className="flex flex-col h-full w-full min-h-0"> 
      <div 
        className="flex flex-col flex-1 bg-white min-h-0"
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="text-center mt-8">
              <h3 className="strong-blue font-semibold text-lg mb-4">Je n'ai pas trouvé la réponse à ma question, je demande de l'aide à HelpAI</h3>
              <div className="space-y-3">
                <p className="text-sm strong-blue font-medium">Suggestions:</p>
                <div className="flex flex-wrap gap-4 w-full justify-center">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="block text-left p-3 text-sm bg-gray-100 cursor-pointer hover:bg-purple-accent hover:text-white rounded-lg transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
                </div>
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
          
          {/* Élément invisible pour le scroll automatique */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-100 p-6 shrink-0">
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