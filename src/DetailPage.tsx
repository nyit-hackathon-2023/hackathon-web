import {Box, Button, Chip, CircularProgress, IconButton, TextField} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import * as React from "react";
import {ArrowBackRounded, ExpandMoreRounded} from "@mui/icons-material";
import {ChatCompletionRequestMessageRoleEnum, Configuration, CreateChatCompletionResponse, OpenAIApi} from "openai";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

function requestOpenAI(
  message: string,
  onStart: () => void,
  onSuccess: (message: string) => void,
  onError: () => void,
) {
  onStart()
  const configuration = new Configuration({
    apiKey: localStorage.getItem('apiKey') ?? '',
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
      onSuccess(r.choices[0].message!!.content)
    })
    .catch(() => {
      onError()
    })
}

interface DetailPageProps {
}

export default function DetailPage(props: DetailPageProps) {

  let { disease } = useParams();
  const diseaseStr = disease as string;

  const [explain, setExplain] = useState('');
  const [explainIsLoading, setExplainIsLoading] = useState(false);
  const explainMessage = `Explain the disease in layman language: ${diseaseStr}`;

  const [studyDesc, setStudyDesc] = useState<any>()
  const [studyDescIsLoading, setStudyDescIsLoading] = useState(false);

  const [studySummary, setStudySummary] = useState('');
  const [studySummaryIsLoading, setStudySummaryIsLoading] = useState(false);
  const studySummaryMessage = `Summarize this article:\n {{message}}`;

  const [suggestion, setSuggestion] = useState('');
  const [suggestionIsLoading, setSuggestionIsLoading] = useState(false);
  const suggestionMessage = `Give me some suggestions about maintaining a healthy lifestyle if I have the disease: ${diseaseStr}`;

  useEffect(() => {
    requestExplain()
    requestStudyDesc()
    requestStudySummary()
    requestSuggestion()
  }, [diseaseStr])

  function requestExplain() {
    requestOpenAI(
      explainMessage,
      () => {
        setExplain('')
        setExplainIsLoading(true)
      },
      (message) => {
        setExplain(message)
        setExplainIsLoading(false)
      },
      () => {
        setExplainIsLoading(false)
      }
    )
  }

  function requestStudyDesc() {
    setStudyDescIsLoading(true)
    setStudyDesc(undefined)
    const url = `https://clinicaltrials.gov/api/query/full_studies?expr=${diseaseStr.replaceAll(' ', '+')}&fmt=json`
    fetch(url)
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        const obj = JSON.parse(data)
        setStudyDesc(obj)
        setStudyDescIsLoading(false)
      })
      .catch(() => {
        setStudyDescIsLoading(false)
      })
  }

  function requestStudySummary() {
    setStudySummary('')
    setStudySummaryIsLoading(true)
    const url = `https://clinicaltrials.gov/api/query/full_studies?expr=${diseaseStr.replaceAll(' ', '+')}&fmt=json`
    fetch(url)
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        const obj = JSON.parse(data)
        const dd = obj.FullStudiesResponse.FullStudies[0].Study.ProtocolSection.DescriptionModule.DetailedDescription
        requestOpenAI(
          studySummaryMessage.replaceAll('{{message}}', dd),
          () => {
          },
          (message) => {
            setStudySummary(message)
            setStudySummaryIsLoading(false)
          },
          () => {
            setStudySummaryIsLoading(false)
          },
        )
      })
      .catch(() => {
        setStudySummaryIsLoading(false)
      })
  }

  function requestSuggestion() {
    setSuggestion('')
    requestOpenAI(
      suggestionMessage,
      () => {
        setSuggestionIsLoading(true)
      },
      (message) => {
        setSuggestion(message)
        setSuggestionIsLoading(false)
      },
      () => {
        setSuggestionIsLoading(false)
      }
    )
  }

  function statusComponent() {
    const status = studyDesc === undefined ? '' : studyDesc.FullStudiesResponse.FullStudies[0].Study.ProtocolSection.StatusModule.OverallStatus;
    switch (status) {
      case 'Completed':
      case 'Active':
      case 'Recruiting':
        return <Chip
          sx={{
            marginTop: '8px',
          }}
          label={status}
          color={'success'}
        />
      default:
        return <Chip
          sx={{
            marginTop: '8px',
          }}
          label={status}
          color={'error'}
        />
    }
  }

  const navigate = useNavigate();

  return (
    <Box
      width={'900px'}
      margin={'0 auto'}
      display={'flex'}
      flexDirection={'column'}
      sx={{
        paddingBottom: '16px',
      }}
    >
      <IconButton
        sx={{
          alignSelf: 'start'
        }}
        onClick={() => {
          navigate(`/`)
        }}
      >
        <ArrowBackRounded/>
      </IconButton>
      <Box
        sx={{
          backgroundImage: "url('https://www.linkpicture.com/q/undraw_medicine_b-1-ol.svg')"
        }}
      >
        <Typography
          variant={'h4'}
          fontWeight={'bold'}
          sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            textAlign: 'center',
            marginTop: '50px',
            marginBottom: '50px',
            textTransform: 'capitalize',
          }}
        >
          {diseaseStr}
        </Typography>
      </Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreRounded />}
          id="explain"
        >
          <Typography
            fontWeight={'bold'}
          >Explanation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{
              whiteSpace: 'pre-wrap',
            }}
            visibility={explainIsLoading ? 'hidden' : 'visible'}
          >
            {explain}
          </Typography>
          <Box
            visibility={!explainIsLoading ? 'hidden' : 'visible'}
          >
            <CircularProgress/>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreRounded />}
          id="studyDesc"
        >
          <Typography
            fontWeight={'bold'}
          >Study desc</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            visibility={studyDescIsLoading ? 'hidden' : 'visible'}
          >
            <Typography
              sx={{
                whiteSpace: 'pre-wrap',
              }}
            >
              {`Title: ${studyDesc === undefined ? '' : studyDesc.FullStudiesResponse.FullStudies[0].Study.ProtocolSection.IdentificationModule.BriefTitle}`}
            </Typography>
            <Typography
              sx={{
                whiteSpace: 'pre-wrap',
              }}
            >
              {`StatusVerifiedDate: ${studyDesc === undefined ? '' : studyDesc.FullStudiesResponse.FullStudies[0].Study.ProtocolSection.StatusModule.StatusVerifiedDate}`}
            </Typography>
            <Typography
              sx={{
                whiteSpace: 'pre-wrap',
              }}
            >
              OverallStatus: {statusComponent()}
            </Typography>
          </Box>
          <Box
            visibility={!studyDescIsLoading ? 'hidden' : 'visible'}
          >
            <CircularProgress/>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreRounded />}
          id="studySummary"
        >
          <Typography
            fontWeight={'bold'}
          >Study Summary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{
              whiteSpace: 'pre-wrap',
            }}
            visibility={studySummaryIsLoading ? 'hidden' : 'visible'}
          >
            {studySummary}
          </Typography>
          <Box
            visibility={!studySummaryIsLoading ? 'hidden' : 'visible'}
          >
            <CircularProgress/>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreRounded />}
          id="suggestion"
        >
          <Typography
            fontWeight={'bold'}
          >Suggestion</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{
              whiteSpace: 'pre-wrap',
            }}
            visibility={suggestionIsLoading ? 'hidden' : 'visible'}
          >
            {suggestion}
          </Typography>
          <Box
            visibility={!suggestionIsLoading ? 'hidden' : 'visible'}
          >
            <CircularProgress/>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
