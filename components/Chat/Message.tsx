'use client'

import { Avatar, Flex } from '@radix-ui/themes'
import ConfettiExplosion from 'react-confetti-explosion';
import { HiUser } from 'react-icons/hi'
import { RiRobot2Line } from 'react-icons/ri'
import { Markdown } from '@/components'
import ChartComponent from './ChartComponent';
import { ChatMessage } from './interface'


export interface MessageProps {
  message: ChatMessage
  handleButtonClick?: (responseText: string) => void;
}

const Message = (props: MessageProps) => {
  const { role, content, augmentation } = props.message
  const { handleButtonClick } = props
  const isUser = role === 'user'

  return (
    <Flex gap="4" className="mb-5">
      <Avatar
        fallback={isUser ? <HiUser className="size-4" /> : <RiRobot2Line className="size-4" />}
        color={isUser ? undefined : 'green'}
        size="2"
        radius="full"
      />
      <div className="flex-1 pt-1 break-all">
        {isUser ? (
          <div
            className="userMessage"
            dangerouslySetInnerHTML={{
              __html: content.replace(
                /<(?!\/?br\/?.+?>|\/?img|\/?table|\/?thead|\/?tbody|\/?tr|\/?td|\/?th.+?>)[^<>]*>/gi,
                ''
              )
            }}
          ></div>
        ) : (
          <Flex direction="column" gap="4">
            <Markdown>{content}</Markdown>
            <Flex gap="4" align="center">

              {augmentation && (
                <>
                  {augmentation.augmentation === "animation" && (
                    <ConfettiExplosion className="confetti-container" />
                  )}
                  {augmentation.augmentation === "response-button" && (
                    <button onClick={() => handleButtonClick?.(augmentation.data.responseText)} className="rt-Box bg-token-surface active:scale-95 truncate cursor-pointer active rt-r-w-auto response-button">
                      {augmentation.data.buttonText}
                    </button>
                  )}
                  {augmentation.augmentation === "chart" && (
                    <div className="chart-container">
                      <ChartComponent config={augmentation.data} />
                    </div>
                  )}

                </>
              )}

            </Flex>
          </Flex>
        )}
      </div>
    </Flex>
  )
}

export default Message
