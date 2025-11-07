"use client"
 
import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { useHelpRequest } from "@/hooks/useHelpRequest"
import "@/utils/debugHelpRequests"

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
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isChatDisabled, setIsChatDisabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { createHelpRequest } = useHelpRequest()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleOpenHelpRequest = () => {
    setShowConfirmation(true)
  }

  const confirmHelpRequest = () => {
    console.log('Demande d\'aide ouverte pour un admin')
    
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    const firstQuestion = firstUserMessage?.content || 'Aucune question spécifique';
    
    const helpRequest = createHelpRequest(firstQuestion, messages);
    
    if (helpRequest) {
      console.log('Demande d\'aide sauvegardée avec succès:', helpRequest.id);
    } else {
      console.error('Erreur lors de la sauvegarde de la demande d\'aide');
    }
    
    setShowConfirmation(false)
    setIsChatDisabled(true)
    
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Votre demande d\'aide a été transmise à un administrateur. Vous recevrez une réponse par mail dans les plus brefs délais. Vous pouvez quitter le chat.'
    }
    setMessages(prev => [...prev, systemMessage])
  }

  const cancelHelpRequest = () => {
    setShowConfirmation(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isChatDisabled) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)
    
    try {
      // Préparer les messages pour l'API (conversion du format)
      const apiMessages = [...messages, userMessage].map(msg => ({
        id: msg.id,
        role: msg.role === 'assistant' ? 'agent' : msg.role, // Convertir 'assistant' en 'agent'
        content: msg.content
      }))

      // Appel API
      const response = await fetch('http://localhost:8000/v1/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`)
      }

      const data = await response.json()
      
      // Créer le message de réponse de l'assistant
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'Désolé, je n\'ai pas pu traiter votre demande.'
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erreur lors de l\'appel API:', error)
      
      // Message d'erreur en cas d'échec
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard ou contacter un administrateur.'
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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
          
          {messages.map((message, index) => (
            <div key={message.id}>
              <div
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
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>,
                          pre: ({ children }) => <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">{children}</pre>,
                          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
              
              {message.role === 'assistant' && !message.content.includes('Votre demande d\'aide a été transmise') && !isChatDisabled && (
                <div className="flex justify-start mt-2 ml-2">
                  <button
                    onClick={handleOpenHelpRequest}
                    className="text-xs px-3 py-1 text-gray-600 hover:text-purple-accent border border-gray-300 hover:border-purple-accent rounded-full transition-colors"
                  >
                    📞 Ouvrir une demande d'aide
                  </button>
                </div>
              )}
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
          
          <div ref={messagesEndRef} />
        </div>

        {showConfirmation && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-20 rounded-2xl">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold strong-blue mb-4">Demande d'aide administrateur</h3>
              <p className="text-gray-700 mb-6">
                Êtes-vous sûr de vouloir ouvrir une demande d'aide ? Un administrateur sera notifié et vous contactera bientôt.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelHelpRequest}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmHelpRequest}
                  className="px-4 py-2 bg-purple-accent text-white rounded-lg hover:opacity-90 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-100 p-6 shrink-0">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isChatDisabled ? "Chat désactivé - demande d'aide envoyée" : "Tapez votre message..."}
              className={`flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-accent focus:border-transparent transition-all duration-200 ${
                isChatDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              style={{
                boxShadow: '0px 0px 10px 0px rgba(76, 87, 125, 0.05)'
              }}
              disabled={isLoading || isChatDisabled}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || isChatDisabled}
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