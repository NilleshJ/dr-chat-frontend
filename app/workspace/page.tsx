"use client"

import { useState, useRef, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import Header from "@/app/components/Header";

const axios = require('axios');

const Chat = ({ params }: { params: { param: string } }) => {
    const messageEl: any = useRef(null);
    const messageContainerRef = useRef(null);
    const mobileMessageContainerRef = useRef(null);
    const preview = typeof window !== 'undefined' && localStorage.getItem('preview') || null;
    const previewList = preview && JSON.parse(preview) || null;

    const [value, setValue] = useState('');
    const [typing, setTyping] = useState(false);
    const [isPreview, setPreview] = useState(false);
    const [isAdd, setAdd] = useState(false);
    const [list, setList] = useState<any>([
        {
            user: true,
            text: 'Hi! How Can I Help You?',
            date: new Date().toISOString()
        }
    ]);
    const [textAlternatives, setTextAlternatives] = useState<any>([]);

    useEffect(() => {
        console.log('list is', list);
        if (previewList) {
            let arrayLength: any[] = previewList && previewList.length > 0 && previewList[previewList.length - 1]?.chat;
            if (arrayLength.length > 1) {
                const newChat = { chat: list };
                previewList?.push(newChat);
                localStorage.setItem('preview', JSON.stringify(previewList));
            }
        } else if (list.length === 1) {
            const data = [{ chat: [{ user: true, text: 'Hi! How Can I Help You?', date: new Date().toISOString() }] }]
            localStorage.setItem('preview', JSON.stringify(data));
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    });

    useEffect(() => {
        console.log('list is', list);
    }, [list]);

    const scrollToBottom = () => {
        messageEl.current?.scrollIntoView({ behavior: "smooth" })
    }

    const onSubmit = async () => {

        setPreview(false);
        const oldPreview = localStorage.getItem('preview');
        let oldPreviewList: any[] = JSON.parse(oldPreview);

        if (value !== '') {
            setTextAlternatives([]);
            const obj = {
                user: false,
                text: value,
                date: new Date().toISOString()
            }
            setList((prevItems: any) => [...prevItems, obj]);
            setTyping(true);

            let config = {
                method: 'post',
                url: `http://16.171.190.115/api/workspace/globaldr/chat`,
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                data: {
                    "message": value,
                    "mode": "chat"
                }
            };

            axios(config)
                .then(async (response: any) => {
                    setTyping(false);
                    console.log('1)response is', response);
                    const obj1 = {
                        user: true,
                        text: response?.data?.textResponse,
                        date: new Date().toISOString()
                    }
                    setList((prevItems: any) => [...prevItems, obj1]);
                    if (response?.data?.sources?.length)
                        setTextAlternatives(response.data.sources)
                    let arrayLength: any[] = oldPreviewList && oldPreviewList.length > 0 && oldPreviewList[oldPreviewList.length - 1]?.chat;
                    arrayLength?.push(obj);
                    arrayLength?.push(obj1);
                    oldPreviewList[oldPreviewList.length - 1].chat = arrayLength;
                    localStorage.setItem('preview', JSON.stringify(oldPreviewList));
                })
                .catch((error: any) => { });

            setValue('');
        }
    }

    const convertDate = (value: any) => {
        const event = new Date(value);
        return event.toDateString()
    }

    const handleNewChat = async () => {
        setPreview(false);
        const chatList = previewList || [];
        let arrayLength: any[] = chatList && chatList.length > 0 && chatList[chatList.length - 1]?.chat;
        if (arrayLength.length > 0) {
            const newChat = { chat: [{ user: true, text: 'Hi! How Can I Help You?', date: new Date().toISOString() }] };
            chatList?.push(newChat);
            localStorage.setItem('preview', JSON.stringify(chatList));
            await setList(newChat.chat);
            setAdd(!isAdd);
        }
    }

    const handleSetPreviewQuestion = (value: any) => {
        setList(value);
        setAdd(!isAdd);
        setPreview(true);
    }

    const scrollToBottom2 = () => {
        console.log('message container height is', messageContainerRef?.current?.style?.height);
    };

    const resizeObserverDesktop = typeof window != 'undefined' && new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.contentRect && window.innerWidth > 991) {

                console.log('desktop height is', entry.contentRect.height, entry.contentRect.bottom, entry);
                window.scrollTo({ top: entry.contentRect.height, behavior: 'smooth' });
                scrollToBottom2();
            }
        }
    })

    const resizeObserverMobile = typeof window != 'undefined' && new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.contentRect && window.innerWidth <= 991) {

                console.log('mobile height is', entry.contentRect.height, entry.contentRect.bottom, entry);
                window.scrollTo({ top: entry.contentRect.height, behavior: 'smooth' });
                scrollToBottom2();
            }
        }
    })

    if (mobileMessageContainerRef?.current)
        typeof window != 'undefined' && resizeObserverMobile?.observe(mobileMessageContainerRef.current);

    if (messageContainerRef?.current)
        typeof window != 'undefined' && resizeObserverDesktop?.observe(messageContainerRef.current);

    const handleDeletePreview = async (tempIndex: number) => {
        const check = previewList[tempIndex];
        const tempPreviews = previewList.filter((preview: any, index: number) => index !== tempIndex);
        await localStorage.setItem('preview', JSON.stringify(tempPreviews));

        if (JSON.stringify(check?.chat) == JSON.stringify(list)) {
            console.log('lists are same');
            const newChat = { chat: [{ user: true, text: 'Hi! How Can I Help You?', date: new Date().toISOString() }] };
            tempPreviews?.push(newChat);
            localStorage.setItem('preview', JSON.stringify(tempPreviews));
            await setList(newChat.chat);
        } else
            console.log('lists are not same', check?.chat, ' and', list);
        setAdd(!isAdd);
    }

    const messageChips = ['Helpline (2022)', 'Helpline (2016)', 'Helpline (2012)'];

    const handleRegenerate = () => {

        if (textAlternatives?.length) {
            // setPreview(false);        
            const oldPreview = localStorage.getItem('preview');
            let oldPreviewList: any[] = JSON.parse(oldPreview);
            const obj1 = {
                user: true,
                text: textAlternatives[0]?.text,
                date: new Date().toISOString()
            }
            setList((prevItems: any) => [...prevItems, obj1]);

            let arrayLength: any[] = oldPreviewList && oldPreviewList.length > 0 && oldPreviewList[oldPreviewList.length - 1]?.chat;
            arrayLength?.push(obj1);
            oldPreviewList[oldPreviewList.length - 1].chat = arrayLength;
            localStorage.setItem('preview', JSON.stringify(oldPreviewList));
            setTextAlternatives(previousTextAlternatives => previousTextAlternatives.slice(1, previousTextAlternatives.length));
        }
    };
    return (
        <>
            <Header handleNewChat={handleNewChat} setList={handleSetPreviewQuestion} list={list} setAdd={setAdd} />
            {/* Sidebar */}
            <aside className="flex hidden lg:flex">
                <div
                    className="flex fixed left-0 h-[100svh] w-72 flex-col overflow-y-auto bg-slate-50 pt-8 dark:border-slate-700 dark:bg-slate-900 sm:h-[100vh] sm:w-72"
                >
                    <div className="mx-2 mt-8">
                        <button onClick={() => handleNewChat()}
                            className="flex w-full gap-x-4 rounded-lg border border-slate-300 p-4 text-left text-sm font-semibold text-secondary transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M12 5l0 14"></path>
                                <path d="M5 12l14 0"></path>
                            </svg>
                            New Chat
                        </button>
                    </div>
                    <div
                        className="h-full space-y-4 overflow-y-auto overflow-x-hidden px-2 py-4"
                    >
                        {previewList && previewList.length > 0 && previewList.map((item: any, index: number) => {
                            return (item?.chat && item.chat?.length > 1 &&
                                <button
                                    onClick={() => {
                                        document.getElementById(`preview-action-${index}`).style.display = 'flex';
                                        // handleSetPreviewQuestion(item?.chat)
                                    }}
                                    onBlur={() => {
                                        document.getElementById(`preview-action-${index}`).style.display = 'none';
                                        // handleSetPreviewQuestion(item?.chat)
                                    }}
                                    className="relative flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200"
                                >
                                    <h1
                                        className="flex w-full truncate text-sm font-semibold capitalize text-secondary dark:text-white overflow-x-hidden"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6 mr-2" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"></path><path d="M12 11l0 .01"></path>
                                            <path d="M8 11l0 .01"></path><path d="M16 11l0 .01"></path>
                                        </svg> {item?.chat[item?.chat?.length - 2]?.text}
                                    </h1>
                                    <p className="text-xs text-secondary dark:text-slate-400 ml-8">{convertDate(item?.chat[item?.chat?.length - 2]?.date)}</p>
                                    <div id={`preview-action-${index}`} className='w-20 absolute right-0 inline-block justify-evenly bg-white dark:bg-black hidden'>
                                        <svg className='pt-1 pl-2' onClick={() => handleSetPreviewQuestion(item?.chat)} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 42 32"><g fill="currentColor"><path d="M35.652 14.023a.5.5 0 0 0-.303.953C39.257 16.221 41 18.078 41 21c0 2.599-2.371 4.616-3.783 5.588A.5.5 0 0 0 37 27v3.823a7.953 7.953 0 0 1-3.126-2.155a.505.505 0 0 0-.468-.159c-.285.055-.576.133-.871.212c-.51.137-1.036.279-1.535.279c-2.568 0-4.366-.552-6.204-1.903a.5.5 0 0 0-.593.806C26.23 29.393 28.199 30 31 30c.631 0 1.223-.159 1.795-.313c.178-.049.355-.097.53-.138c1.869 1.974 3.983 2.423 4.075 2.441a.495.495 0 0 0 .416-.103A.498.498 0 0 0 38 31.5v-4.239c2.582-1.841 4-4.057 4-6.261c0-3.381-2.017-5.598-6.348-6.977z" /><path d="M33 13.5C33 5.804 25.982 0 16.677 0C7.325 0 0 5.931 0 13.502c0 4.539 3.211 7.791 6 9.759v6.636a.502.502 0 0 0 .705.456c.146-.065 3.559-1.616 6.479-4.809c1.265.235 2.696.461 3.994.461C26.641 26.005 33 20.979 33 13.5zM17.177 25.005c-1.31 0-2.799-.251-4.083-.496a.507.507 0 0 0-.468.159C10.576 26.98 8.167 28.449 7 29.082V23a.5.5 0 0 0-.217-.412C4.145 20.773 1 17.725 1 13.502C1 6.491 7.886 1 16.677 1C25.413 1 32 6.374 32 13.5c0 6.882-5.957 11.505-14.823 11.505z" /><path d="M16.5 11.5c-1.103 0-2 .897-2 2s.897 2 2 2s2-.897 2-2s-.897-2-2-2zm0 3a1.001 1.001 0 0 1 0-2a1.001 1.001 0 0 1 0 2zm7-3c-1.103 0-2 .897-2 2s.897 2 2 2s2-.897 2-2s-.897-2-2-2zm0 3a1.001 1.001 0 0 1 0-2a1.001 1.001 0 0 1 0 2zm-14-2.905c-1.103 0-2 .897-2 2s.897 2 2 2s2-.897 2-2s-.897-2-2-2zm0 3a1.001 1.001 0 0 1 0-2a1.001 1.001 0 0 1 0 2z" /></g></svg>

                                        <svg onClick={() => { handleDeletePreview(index) }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 72 72"><path fill="#FFF" d="M51.76 17H20.153v37.65c0 4.06 3.29 5.62 7.35 5.62H44.41c4.06 0 7.35-1.56 7.35-5.62V17zM31 16v-4h10v4" /><path fill="#9B9B9A" d="M51 37v20.621L48.3 60H33z" /><path fill="#FFF" d="M17 16h38v4H17z" /><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M31 16v-4h10v4m10 9v31a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V25m-4-9h38v4H17zm24 12.25V55M31 28.25V55" />
                                        </svg>
                                    </div>
                                </button>
                            )
                        }
                        )}
                    </div>
                </div>
                <div className={`flex h-full w-full flex-col`}>
                    <div
                        ref={messageContainerRef}
                        className="flex-1 mb-12 mr-40 ml-[28rem] space-y-6 scroll-smooth hover:scroll-auto overflow-y-auto bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:bg-slate-900 dark:text-slate-300 sm:text-base sm:leading-7"
                    >
                        <div className='pt-10'></div>
                        {list && list.length > 0 && list.map((item: any, index: number) =>
                            <>
                                {item?.user ?
                                    <div key={index} className="flex items-start">
                                        <img
                                            className="mr-2 h-8 w-8 rounded-full"
                                            src={'/AI.jpg'} alt='img'
                                        />
                                        <div
                                            className="rounded-b-xl text-sm text-secondary dark:text-white rounded-tr-xl bg-sky-chat p-4 dark:bg-slate-chat sm:max-w-md md:max-w-2xl"
                                        >
                                            {
                                                (!isPreview && (index + 1) === list.length) ? <Typewriter options={{
                                                    delay: 20,
                                                }}
                                                    onInit={(typewriter) => {
                                                        typewriter.typeString(item?.text)
                                                            .pauseFor(2500)
                                                            .callFunction(() => { messageEl.current?.scrollIntoView({ behavior: "smooth" }) })
                                                            .start();
                                                    }}
                                                />
                                                    :
                                                    <p className='text-sm text-secondary dark:text-white'>{item?.text}</p>
                                            }
                                            {/* {
                                                  messageChips?.length &&
                                                  <div className='flex w-full bg-slate-400 border-t border-slate-800'>
                                                    {messageChips.map((messageChip, index) => (
                                                      <div className='flex p-2 bg-white items-center mx-1 mt-1 rounded-full dark:bg-black'><span className='text-md font-semibold  mr-1'>{index+1}</span>{messageChip}<span className='ml-1'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/></svg>
                                                      </span></div>
                                                    ))}
                                                  </div>
                                                } */}
                                        </div>
                                        <div
                                            className="ml-2 mt-1 flex flex-col-reverse gap-2 text-slate-500 sm:flex-row"
                                        >
                                            <button className="hover:text-primary text-secondary dark:text-secondary dark:hover:text-primary" type="button" onClick={() => navigator.clipboard.writeText(item?.text)}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path
                                                        d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
                                                    ></path>
                                                    <path
                                                        d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div> :
                                    !item?.user && <div key={index} className="flex flex-row-reverse items-start">
                                        <img
                                            className="ml-2 h-8 w-8 rounded-full"
                                            src="https://dummyimage.com/128x128/354ea1/ffffff&text=G"
                                        />

                                        <div
                                            className="flex rounded-b-xl rounded-tl-xl bg-sky-chat p-4 dark:bg-slate-chat sm:min-h-0 sm:max-w-md md:max-w-2xl"
                                        >
                                            <p className='text-sm text-secondary dark:text-white'>{item?.text}</p>
                                        </div>
                                    </div>
                                }
                                {typing && list.length == (index + 1) &&
                                    <div key={index} className="flex items-start">
                                        <img
                                            className="mr-2 h-8 w-8 rounded-full"
                                            src={'/AI.jpg'} alt='img'
                                        /><img src={'/typing.gif'} className='w-10' alt="typing" />
                                    </div>
                                }
                            </>
                        )
                        }
                        <div ref={messageEl} />
                    </div>

                    {
                        textAlternatives?.length && window.innerWidth > 991 ? <button onClick={handleRegenerate} className='text-sm text-secondary dark:text-white flex gap-3 p-2 bg-input rounded items-center fixed bottom-20 right-40 dark:bg-slate-chat'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
                            Regenerate
                        </button>
                            :
                            null
                    }
                    <div className="mr-40 ml-[28rem] py-2 pb-4 w-[-webkit-fill-available] fixed bottom-0 bg-white dark:bg-black">
                        <label htmlFor="chat-input" className="sr-only">Enter your prompt</label>
                        <form className="relative" onSubmit={onSubmit}>
                            <input autoFocus value={value} onChange={(e) => setValue(e.target.value)}
                                id="value" disabled={typing}
                                autoComplete="off"
                                className="block w-full resize-none rounded-xl border-none bg-input p-2 pl-5 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-dark dark:text-white dark:placeholder-white[0.4] dark:focus:ring-blue-600 sm:text-base"
                                placeholder="Enter your prompt"
                            />
                            <button type="submit" onClick={() => onSubmit()} disabled={typing || (value === '' ? true : false)}
                                className={`absolute bottom-1 right-2.5 rounded-lg bg-primary ${value === '' && 'bg-icon-gray'} px-4 py-2 text-white`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="h-4 w-4 m-1 md:m-0" strokeWidth="2">
                                    <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
            <div className="flex lg:hidden h-full w-full flex-col">
                <div
                    ref={mobileMessageContainerRef}
                    className="flex-1 mb-12 space-y-6 p-4 text-sm sm:text-base"
                >
                    <div className='pt-10'></div>
                    {list && list.length > 0 && list.map((item: any, index: number) =>
                        <>
                            {item?.user ?
                                <div key={index} className="flex items-start">
                                    <img
                                        className="mr-2 h-8 w-8 rounded-full"
                                        src={'/AI.jpg'} alt='img'
                                    />
                                    <div
                                        className="flex rounded-b-xl text-sm text-secondary dark:text-white rounded-tr-xl bg-sky-chat p-4 dark:bg-slate-chat sm:max-w-md md:max-w-2xl"
                                    >
                                        {(!isPreview && (index + 1) === list.length) ? <Typewriter options={{
                                            delay: 20,
                                        }}
                                            onInit={(typewriter) => {
                                                typewriter.typeString(item?.text)
                                                    .pauseFor(2500)
                                                    .callFunction(() => { messageEl.current?.scrollIntoView({ behavior: "smooth" }) })
                                                    .start();
                                            }}
                                        /> :
                                            <p className='text-sm text-secondary dark:text-white'>{item?.text}</p>}
                                    </div>
                                    <div
                                        className="ml-2 mt-1 flex flex-col-reverse gap-2 text-slate-500 sm:flex-row"
                                    >
                                        <button className="hover:text-primary text-secondary dark:text-secondary dark:hover:text-primary" type="button" onClick={() => navigator.clipboard.writeText(item?.text)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path
                                                    d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
                                                ></path>
                                                <path
                                                    d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div> :
                                !item?.user && <div key={index} className="flex flex-row-reverse items-start">
                                    <img
                                        className="ml-2 h-8 w-8 rounded-full"
                                        src="https://dummyimage.com/128x128/354ea1/ffffff&text=G"
                                    />

                                    <div
                                        className="flex rounded-b-xl rounded-tl-xl bg-sky-chat p-4 dark:bg-slate-chat sm:min-h-0 sm:max-w-md md:max-w-2xl"
                                    >
                                        <p className='text-sm text-secondary dark:text-white'>{item?.text}</p>
                                    </div>
                                </div>
                            }
                            {typing && list.length == (index + 1) &&
                                <div key={index} className="flex items-start">
                                    <img
                                        className="mr-2 h-8 w-8 rounded-full"
                                        src={'/AI.jpg'} alt='img'
                                    /><img src={'/typing.gif'} className='w-10' alt="typing" />
                                </div>
                            }
                        </>
                    )
                    }
                    <div ref={messageEl} />
                </div>
                {
                    textAlternatives?.length && window.innerWidth <= 991 ? <button onClick={handleRegenerate} className='text-sm text-secondary dark:text-white flex gap-1.5 p-1 bg-input rounded items-center fixed bottom-[70px] right-4 dark:bg-slate-chat'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
                        Regenerate
                    </button>
                        :
                        null
                }
                <div className="fixed bottom-0 py-2 px-4 pb-4 w-[-webkit-fill-available] bg-white dark:bg-black">
                    <form className="relative" onSubmit={onSubmit}>
                        <input autoFocus value={value} onChange={(e) => setValue(e.target.value)}
                            id="value" disabled={typing}
                            className="block w-full resize-none rounded-xl border-none bg-input p-2 py-3 pl-5 pr-20 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-dark dark:text-white dark:placeholder-white[0.4] dark:focus:ring-blue-600 sm:text-base"
                            placeholder="Enter your prompt"
                            autoComplete="off"
                        />
                        <button type="submit" onClick={() => onSubmit()} disabled={typing || (value === '' ? true : false)}
                            className={`absolute bottom-1.5 right-2.5 rounded-lg bg-primary ${value === '' && 'bg-icon-gray'} px-3 py-1 text-white`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="h-4 w-4 m-1 md:m-0" strokeWidth="2">
                                <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Chat;