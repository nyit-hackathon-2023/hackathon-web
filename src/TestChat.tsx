import {
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi
} from "openai";
import {Box, Button, Typography} from "@mui/material";
import {useState} from "react";

interface TestChatPageProps {
}

export default function TestChatPage() {
  const [response, setResponse] = useState('')

  function request(
    message: string,
    onRequestStart: () => void,
    onRequestSuccess: (response: string) => void,
    onRequestError: () => void,
  ) {
    onRequestStart()
    const configuration = new Configuration({
      apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);
    openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          content: message,
          role: ChatCompletionRequestMessageRoleEnum.User,
        }
      ]
    })
      .then((response) => {
        const r: CreateChatCompletionResponse = response.data;
        onRequestSuccess(r.choices[0].message!!.content);
      })
      .catch(() => {
        onRequestError();
      })
  }

  return (
    <Box>
      <Button
        onClick={() => request(``, () => {}, (message) => { setResponse(message)}, () => {})}
      >
        {'Request'}
      </Button>
      <Typography>
        {response}
      </Typography>
    </Box>
  )
}
