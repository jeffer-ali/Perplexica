'use client'
import React, { useEffect, useState } from 'react'
import { ModeToggle } from './mode-toggle'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { EllipsisVertical, X, ChevronLeft } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { SearchInput } from './search-input'
import { useGlobalContext } from '@/app/globalContext'
import { nanoid } from 'ai'
import { AvatarDropdown } from './avatar-dropdown'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { HeaderDropdownMenu } from './header-dropdown-menu'
import { History } from './history'
import { MobileMarkMap } from './mobile-markmap'
import { cn, isMobileDeviceFn } from '@/lib/utils'
import { CircleX } from 'lucide-react'
import HistoryContent from './history-content'
import { useTranslations } from 'use-intl'
import { MediaSocial } from './media-social'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel
} from '@/components/ui/alert-dialog'
import Login from '@/components/login-component'
import { useTheme } from 'next-themes'
import LocationInput from './locationInput'

export const Header: React.FC = () => {
  const router = useRouter()
  const path = usePathname()
  const [isMobileScroll, setIsMobileScroll] = useState(false)
  const {
    showComponents,
    userInfo,
    language,
    setLanguage,
    isSpark,
    loginModalOpen,
    setLoginModalOpen,
    isUsed
  } = useGlobalContext()
  const [openMobileWeChat, setOpenMobileWeChat] = useState(false)
  const [opentHistorySheet, setOpentHistorySheet] = useState(false) // 移动端历史记录是否显示
  const { theme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState(theme) // 用于login组件的主题
  const t = useTranslations()

  useEffect(() => {
    if (theme === 'system' && typeof window !== 'undefined') {
      const matchMedia = window?.matchMedia('(prefers-color-scheme: dark)')
      if (matchMedia.matches) {
        setCurrentTheme('dark')
      } else {
        setCurrentTheme('light')
      }
    } else {
      setCurrentTheme(theme)
    }
  }, [theme])

  useEffect(() => {
    const onScroll = function () {
      const ele = document.getElementById('chatWraper') as HTMLElement
      const scrollTop =
        window.innerWidth > 768 ? ele?.scrollTop : window.scrollY
      setIsMobileScroll(scrollTop > 0)
    }
    window.addEventListener('scroll', onScroll, true)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const showHeaderSearch = () => {
    if (path.includes('search') || path.includes('products')) {
      if (isMobileDeviceFn()) {
        return (
          <SearchInput
            showHeader
            id={nanoid(21)}
            isMobileScrollCls
            isMobileScroll={isMobileScroll}
          />
        )
      } else {
        return (
          <div className="max-md:hidden">
            <SearchInput
              showHeader
              id={nanoid(21)}
              isMobileScroll={isMobileScroll}
            />
          </div>
        )
      }
    }
  }

  const handleChangeLanguage = (value: string) => {
    setLanguage(value)
  }

  const leftPart = (
    <div className="flex items-center max-md:flex-auto">
      <a href="/">
        {path.includes('search') || path.includes('products') ? (
          <div className='flex flex-row items-center'>
            <div className="max-md:hidden">
              <Image
                src={
                  'https://img.alicdn.com/imgextra/i2/O1CN0140RuqV1yYjQtGyfKx_!!6000000006591-2-tps-206-80.png'
                }
                alt={'logo'}
                width={103}
                height={40}
                className="block dark:hidden"
              />
              <Image
                src={
                  'https://img.alicdn.com/imgextra/i2/O1CN01qlapag1ahO8ikoO7o_!!6000000003361-2-tps-206-80.png'
                }
                alt={'dark-logo'}
                className="hidden dark:block"
                width={103}
                height={40}
              />
            </div>
            <div className='ml-2 mr-6 text-[#FFFFFF] text-center text-xs/[12px] font-bold tracking-normal px-2.5 py-[4px] rounded-full bg-[#000000]'>
              thrift
            </div>
          </div>
        ) : null}
        <span className="sr-only">X Answer</span>
      </a>
      {showHeaderSearch()}
    </div>
  )

  const historyTrigger = (
    <Popover>
      <PopoverTrigger>
        <div className="text-sm lending-[22px] text-search-header ml-5 cursor-pointer flex items-center max-md:hidden">
          <Image
            src={
              'https://img.alicdn.com/imgextra/i3/O1CN01T39k971lgR5NLXgzi_!!6000000004848-2-tps-36-36.png'
            }
            alt={'search-history'}
            width={18}
            height={18}
            className="opacity-0.65 dark:invert"
          />
          <span className="ml-2 block leading-[22px] dark:text-white max-md:hidden">
            {t('xanswer.history')}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={`p-0  border-0 ${path.includes('search') ? 'mt-[30px] mr-[-30px]' : ''
          }`}
      >
        <HistoryContent />
      </PopoverContent>
    </Popover>
  )

  const historyComponent = () => {
    if (!userInfo?.email) {
      return (
        <div
          className="text-sm lending-[22px] text-search-header ml-5 cursor-pointer flex items-center max-md:hidden"
          onClick={() => setLoginModalOpen(true)}
        >
          <Image
            src={
              'https://img.alicdn.com/imgextra/i3/O1CN01T39k971lgR5NLXgzi_!!6000000004848-2-tps-36-36.png'
            }
            alt={'search-history'}
            width={18}
            height={18}
            className="opacity-0.65 dark:invert"
          />
          <span className="ml-2 block leading-[22px] dark:text-white max-md:hidden">
            {t('xanswer.history')}
          </span>
        </div>
      )
    } else {
      return historyTrigger
    }
  }

  if (isSpark) {
    return (
      <header
        className={cn(
          `
  fixed w-full px-8 py-4 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-white dark:bg-chat-box max-md:h-12 max-md:py-2 max-md:pl-[10px] max-md:pr-[10px] max-md:border-b max-md:border-header-bottom-border max-md:dark:border-0 max-md:bg-white max-md:dark:bg-chat-box`,
          showComponents.includes('search')
            ? 'border-b border-b-header-bottom dark:border-b-follow-up-btn-border'
            : ''
        )}
      >
        {leftPart}
        {historyTrigger}
      </header>
    )
  }

  return (
    <header
      className={cn(
        `
    fixed w-full px-8 py-4  flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-white dark:bg-chat-box max-md:h-12 max-md:py-2 max-md:pl-[10px] max-md:pr-[10px] max-md:border-header-bottom-border max-md:dark:border-1 max-md:bg-white max-md:dark:bg-chat-box`,
        showComponents.includes('search')
          ? 'border-b border-b-header-bottom dark:border-b-follow-up-btn-border max-md:border-b'
          : ''
      )}
    >
      {leftPart}
      <div className="flex gap-0.5 items-center max-md:ml-4">
        <LocationInput />
        <MediaSocial />
        {/* 多语言 */}
        <div className="mr-4 max-md:hidden">
          <Select defaultValue={language} onValueChange={handleChangeLanguage}>
            <SelectTrigger className="border-none focus:outline-none focus:ring-offset-0 focus:ring-0 p-0 text-sm leading-[22px] text-search-header bg-transparent foucs:border-0 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-popover-background dark:shadow-pover-box-shadow">
              <SelectItem
                value="zh"
                className="text-sm leading-[22px] text-search-header dark:text-white"
              >
                {t('xanswer.language_Chinese')}
              </SelectItem>
              <SelectItem
                value="en"
                className="text-sm leading-[22px] text-search-header dark:text-white"
              >
                {t('xanswer.language_English')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* 主题色 */}
        {showComponents.includes('login') ? null : (
          <>
            <ModeToggle />
            {/* 移动端思维导图图标 */}
            {showComponents.includes('search') ||
              showComponents.includes('detail') ? (
              <MobileMarkMap />
            ) : null}

            {/* 移动端搜索记录 */}
            <div className="hidden">
              <History
                location="header"
                opentHistorySheet={opentHistorySheet}
                setOpentHistorySheet={setOpentHistorySheet}
              />
            </div>
            {historyComponent()}
            {/* 登录 */}
            {!userInfo?.email ? (
              <AlertDialog
                open={loginModalOpen}
                onOpenChange={setLoginModalOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button className="w-24 rounded-lg text-base leading-7 ml-6 dark:bg-main-color dark:text-white max-md:w-[60px] max-md:text-sm max-md:leading-[22px] max-md:h-8 max-md:ml-3">
                    {t('xanswer.sign_in')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="p-0 w-auto overflow-hidden">
                  <AlertDialogCancel
                    className="absolute top-0 right-0 border-0 pt-4 hover:bg-white dark:bg-login-modal max-md:hidden"
                    onClick={() => setLoginModalOpen(false)}
                  >
                    <X className="text-close-login" />
                  </AlertDialogCancel>
                  <div className="hidden max-md:block w-full">
                    <AlertDialogCancel className="absolute top-[60px] left-0 h-[48px] flex items-center ml-4 w-full justify-start border-0 border-b border-b-mobile-header-back max-md:border-0">
                      <ChevronLeft size={16} className="opacity-65 mr-2" />
                      <Image
                        src={
                          'https://img.alicdn.com/imgextra/i2/O1CN01qlsElj1hB3UPLJhrz_!!6000000004238-2-tps-312-120.png'
                        }
                        alt={'login-logo'}
                        width={104}
                        height={40}
                        className="block dark:hidden"
                      />
                      <Image
                        src={
                          'https://img.alicdn.com/imgextra/i1/O1CN01kEzjLF1g9ORYV1DON_!!6000000004099-2-tps-192-64.png'
                        }
                        alt={'login-logo'}
                        width={104}
                        height={40}
                        className="hidden dark:block"
                      />
                    </AlertDialogCancel>
                  </div>
                  <Login
                    theme={currentTheme}
                    darkMainColor={'#FF2E4D'}
                    locale={language}
                  />
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <>
                <div className="w-px h-5 ml-4 mr-4 flex items-center justify-center max-md:hidden">
                  <div className="w-px bg-current opacity-[0.2] h-full"></div>
                </div>
                <AvatarDropdown
                  setOpenMobileWeChat={setOpenMobileWeChat}
                  setOpentHistorySheet={setOpentHistorySheet}
                />
              </>
            )}
            {/* 移动端 */}
            {!userInfo?.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden max-md:block">
                  <div className="ml-2">
                    <EllipsisVertical size={24} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="px-4 w-[220px] max-md:dark:bg-mobile-dark-header-dropdown"
                >
                  <HeaderDropdownMenu
                    setOpenMobileWeChat={setOpenMobileWeChat}
                    setOpentHistorySheet={setOpentHistorySheet}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            {openMobileWeChat ? (
              <>
                <div className="w-screen h-screen bg-slogan-text fixed left-0 top-0 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center flex-col relative">
                    <Image
                      src={
                        'https://img.alicdn.com/imgextra/i3/O1CN01JfeuCh1P9X6EMJjiw_!!6000000001798-0-tps-1125-1125.jpg'
                      }
                      alt={'mobile-wechat'}
                      width={208}
                      height={208}
                    />
                    <div className="mt-4 text-base text-default-search-content-color">
                      {t('xanswer.weChat_group')}
                    </div>
                    <CircleX
                      size={28}
                      color={'#fff'}
                      className="absolute left-[106px] bottom-[-44px]"
                      onClick={() => setOpenMobileWeChat(false)}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </header>
  )
}

export default Header
