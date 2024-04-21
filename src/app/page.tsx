'use client'
import { Box, Button, Center, Container, Flex, FormLabel, HStack, Heading, Image, Input, InputGroup, InputLeftElement, Select, Stack, useToast, Text, Textarea, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";
import { MdKey } from "react-icons/md";
import SyntaxHighlighter from 'react-syntax-highlighter';

export default function Home() {

  const dialectType: string[] = [
    '🖖 Klingon',
    '🐷 Pig Latin',
    '🍌 Minionese',
    '👩‍👩‍👧‍👦 Simlish',
    '🐾 Furbish',
    '🍊 Nadsat',
    '📰 Newspeak',
    '🐻 Wookiee',
    '🏄 Surfer Slang',
    `👽 Na'vi`,
    '🤠 Texan Twang',
    '⛪ Scouse',
    '🏰 Geordie',
    '🌄 Appalachian English',
    '✡️ Yeshivish'
  ]

  const toast = useToast()
  const [apiKey, setApiKey] = useState<null | string>(null)
  const [dialect, setDialect] = useState<null | string>(null)
  const [language, setLanguage] = useState<string>(SyntaxHighlighter.supportedLanguages[85])
  const [methodName, setMethodName] = useState<string | null>(null)

  const selectRandomDialect = () => {
    const randomIndex = Math.floor(Math.random() * dialectType.length);
    setDialect(dialectType[randomIndex]);
  }

  const exampleCodeString =
    `
  () => {
    const { subscription, onSuccessUnsubscribe, dispatch } = this.props

    this.loading(true)

    dispatch(messageShow('Unsubscribing, please wait...'))

    dispatch(remove({ id: subscription.id }))
      .then(response => {
        if (response.data.errors && response.data.errors.length > 0) {
          dispatch(messageShow(response.data.errors[0].message))

          this.loading(false)
        } else {
          dispatch(messageShow('Unsubscribed successfully.'))

          onSuccessUnsubscribe()
        }
      })
      .catch(() => {
        dispatch(messageShow('There was some error unsubscribing. Please try again.'))

        this.loading(false)
      })
      .then(() => {
        setTimeout(() => {
          dispatch(messageHide())
        }, config.message.error.timers.long)
      })
  `;

  const [codeString, setCodeString] = useState<string>(exampleCodeString)

  const testName = 'ThisIsAnExampleOfAMethodName'

  const colorizeCapitalWords = (text: string) => {
    const words = text.match(/[A-Z][a-z]+/g) || [];
    const coloredWords = words.map(word => {
      // Ensuring enough contrast with the background by generating colors with a minimum brightness
      let color;
      do {
        color = "#" + Math.floor(Math.random() * 16777215).toString(16);
      } while (!isColorBrightEnough(color));
      return `<span style="color:${color}">${word}</span>`;
    });
    return <Center><Box fontSize={30} dangerouslySetInnerHTML={{ __html: coloredWords.join('') }}></Box></Center>
  }

  // Helper function to check if color is bright enough
  const isColorBrightEnough = (color: string) => {
    const rgb = parseInt(color.substring(1), 16); // convert hex to rgb
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b; // using luminance formula
    return brightness > 10; // threshold for brightness
  }

  const systemPromptTemplate =
    `Hey you have a simple job.
  You will be provided a method by the user.
  The programming language is LANGUAGE.
  First thing about what the whole provided method is doing.
  Then create a using at lest 10 words, suggest a name for the method that describes what the whole function does, be sure to add extra unneeded words.
  This method name should be writting using a DIALECT dialect.
  The method name should have no spaces, every word should start with a capital letter.
  do not describe anything.
  return only the suggested method name.
  example: I expect the only thing to be in the repsonse is "ThisIsAMethodName"
  `
  const [systemPrompt, setSystemPrompt] = useState<string>(systemPromptTemplate)

  useEffect(() => {
    let updatedPrompt = systemPromptTemplate
    updatedPrompt = updatedPrompt.replace('LANGUAGE', language)
    updatedPrompt = updatedPrompt.replace('DIALECT', dialect ?? 'Not Selected')
    setSystemPrompt(updatedPrompt)
  }, [language, systemPromptTemplate, dialect])


  const getName = async () => {
    const url = '/nameGenerator'

    await fetch(url, {
      method: "post",
      body: JSON.stringify({
        apiKey: apiKey,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: codeString }
        ]
      })
    }).then(async (resp) => {
      if (resp.status !== 200) {
        throw new Error('seomthing went wrong');
      }

      const data = await resp.json()

      if (data.error) {

        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        // throw new Error('Failed to generate method name due to an error in the response.');
      } else {
        setMethodName(data.methodName)
      }
    })
      .catch((error) => {
        toast({
          title: 'Something went wrong',
          description: "I'm too lazy to catch everything, check your api key",
          status: 'success',
          duration: 9000,
          isClosable: true,
          status: 'error'
        })
      })
  }

  return (
    <Container maxW={'5xl'} marginBottom={20}>

      {/* {colorizeCapitalWords(testName)} */}
      <Center>
        <Heading fontSize={60} marginY={10}> JavaishNameLonger</Heading>
      </Center>

      <Flex gap={10}>
        <Box>
          <Text fontSize={30}>
            Have you ever thought to yourself &quot;wow, this method name is not long enough, and it needs more Java? &quot;
          </Text>

          <Text fontSize={30} marginTop={10}>
            Well do I have the soultion for you!
          </Text>
        </Box>
        <Image src='./imgs/finglonger.jpg' alt='Finglonger image from Futurama' />
      </Flex>

      <Stack spacing={4} marginTop={20}>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <MdKey />
          </InputLeftElement>
          <Input type='password' placeholder='OpenAI Key' onChange={(event) => { setApiKey(event.target.value) }} />
        </InputGroup>

        <Button rightIcon={<GiDiceTwentyFacesTwenty />} colorScheme='teal' onClick={() => selectRandomDialect()} >
          Random Dialect
        </Button>
        <InputGroup>
          <Select value={dialect?.toString()} onChange={(event) => { setDialect(event.target.value) }}>
            <option value={'0'}>Select a Dialect</option>
            {dialectType.map((dialect, index) => (
              <option key={index} value={dialect}>{dialect}</option>
            ))}
          </Select>
        </InputGroup>

        <HStack>
          <VStack maxW={'50%'} minW={'48%'}>
            <Select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {SyntaxHighlighter.supportedLanguages.map((language, index) => (
                <option key={index} value={language}>{language}</option>
              ))}
            </Select>
            <Textarea value={codeString} onChange={(event) => { setCodeString(event.target.value) }} rows={10} />
          </VStack>

          <SyntaxHighlighter language={language} >
            {codeString}
          </SyntaxHighlighter>
        </HStack>

        <Button colorScheme={'blue'} onClick={() => { getName() }}>Generate</Button>

        {methodName && (
          <>
            Generated Method Name: {colorizeCapitalWords(methodName)}
          </>
        )}
      </Stack>
    </Container >
  );
}


