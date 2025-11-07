from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, BaseMessage
from langchain_core.outputs import ChatResult, ChatGeneration
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import requests
from typing import List, Optional, Any
from pydantic import Field

class IBMWatsonxChat(BaseChatModel):
    api_key: str = Field(...)
    project_id: str = Field(...)
    model_id: str = Field(...)
    api_url: str = Field(...)
    
    class Config:
        """Configuration for this pydantic object."""
        arbitrary_types_allowed = True

    @property
    def _llm_type(self) -> str:
        """Return type of chat model."""
        return "ibm-watsonx"

    def _generate(self, messages: List[BaseMessage], stop: Optional[List[str]] = None, run_manager: Optional[Any] = None, **kwargs) -> ChatResult:
        # Convertir la liste de messages LangChain → prompt texte
        user_prompt = ""
        for msg in messages:
            if isinstance(msg, SystemMessage):
                user_prompt += f"[System] {msg.content}\n"
            elif isinstance(msg, HumanMessage):
                user_prompt += f"{msg.content}\n"
        print("User Prompt:", user_prompt)

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + self.generate_access_token(),
        }

        body = {
            "messages": [{"role":"system","content":user_prompt},{"role":"user","content":[{"type":"text","text":"bonjour"}]},{"role":"assistant","content":"### Hello\n**Welcome** to our conversation. I'm here to help with any questions or topics you'd like to discuss. \n\nPlease feel free to ask me anything, and I'll do my best to provide a helpful and informative response. \n\n### How can I assist you today?"}],
            "model_id": self.model_id,
            "project_id": self.project_id,
            "input": user_prompt,
            "frequency_penalty": 0,
            "max_tokens": 200,
            "presence_penalty": 0,
            "temperature": 0,
            "top_p": 1
        }

        response = requests.post(self.api_url, headers=headers, json=body)
        response.raise_for_status()
        data = response.json()
        text = data['choices'][0]['message']['content']

        # Retourner ChatResult au lieu de AIMessage directement
        message = AIMessage(content=text)
        generation = ChatGeneration(message=message)
        return ChatResult(generations=[generation])
    
    def generate_access_token(self) -> str:
        authenticator = IAMAuthenticator(self.api_key)

        access_token = authenticator.token_manager.get_token()
        return access_token
