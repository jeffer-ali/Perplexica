'use client'
import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getFirstLetterAndUpperCase } from '@/lib/utils/index'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { useGlobalContext } from '@/app/globalContext'
import { HeaderDropdownMenu } from './header-dropdown-menu'
import { useTranslations } from 'use-intl'

interface AvatarDropdownProps {
  setOpenMobileWeChat?: (openMobileWeChat: boolean) => void
  setOpentHistorySheet?: (open: boolean) => void
}

export function AvatarDropdown(props: AvatarDropdownProps) {
  const { setOpenMobileWeChat, setOpentHistorySheet } = props
  const router = useRouter()
  const { userInfo } = useGlobalContext()
  const t = useTranslations()

  const signOut = useCallback(() => {
    fetch('/api/signOut', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      window.location.replace('/')
    })
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-auto mr-0 hover:border-0 hover:bg-transparent active:border-0 active:bg-transparent focus-visible:ring-0 max-md:ml-[8px]"
          >
            <div className="flex items-center justify-center text-base rounded-full w-8 h-8 cursor-pointer text-main-color dark:bg-avatar-dropdown-dark-bg dark:text-white bg-avatar-dropdown-bg max-md:w-6 max-md:h-6">
              {getFirstLetterAndUpperCase(userInfo?.email)}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-md:dark:bg-mobile-dark-header-dropdown"
        >
          <DropdownMenuItem className="focus:bg-transparent py-2">
            <div className="flex items-center">
              <span className="flex items-center justify-center text-base rounded-full w-8 h-8 bg-avatar-dropdown-bg text-main-color mr-4 dark:bg-avatar-dropdown-dark-bg dark:text-white">
                {getFirstLetterAndUpperCase(userInfo?.email)}
              </span>
              <span>{userInfo?.email}</span>
            </div>
          </DropdownMenuItem>
          <div className="hidden max-md:block">
            <DropdownMenuSeparator className="m-0" />
            <HeaderDropdownMenu
              setOpenMobileWeChat={setOpenMobileWeChat}
              setOpentHistorySheet={setOpentHistorySheet}
            />
            <DropdownMenuSeparator className="m-0" />
          </div>
          <DropdownMenuItem
            onClick={signOut}
            className="bg-avatar-dropdown py-2 pl-5 cursor-pointer dark:bg-black border-t border-avatar-dropdown dark:border-avatar-dropdown-dark-bg max-md:bg-white max-md:border-0 max-md:dark:bg-mobile-dark-header-dropdown"
          >
            <div className="hidden max-md:block max-md:mr-1">
              <Image
                src={
                  'https://img.alicdn.com/imgextra/i3/O1CN01hDFC4h28XwucgFpBZ_!!6000000007943-55-tps-16-16.svg'
                }
                alt={'sign-out'}
                width={16}
                height={16}
                className="dark:invert"
              />
            </div>
            {t('xanswer.sign_out')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
