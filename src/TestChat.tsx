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

  function request() {
    const configuration = new Configuration({
      apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);
    openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          content: ``,
          role: ChatCompletionRequestMessageRoleEnum.User,
        }
      ]
    })
      .then((response) => {
        const r: CreateChatCompletionResponse = response.data;
        setResponse(r.choices[0].message!!.content);
      })
      .catch(() => {
        setResponse('error');
      })
  }

  return (
    <Box>
      <Button
        onClick={() => request()}
      >
        {'Request'}
      </Button>
      <Typography>
        {response}
      </Typography>
    </Box>
  )
}
