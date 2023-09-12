"use client"

import { useState } from "react";
import { Drawer } from "@material-tailwind/react";

export default function Sidebar({ open, closeDrawer, handleNewChat, setList, list, setAdd }: any) {
    const [previouslySelectedPreview, setPreviouslySelectedPreview] = useState(null);
    const preview = typeof window !== 'undefined' && localStorage.getItem('preview') || null;
    const previewList = preview && JSON.parse(preview) || null;

    const handleChat = async () => {
        await handleNewChat()
        closeDrawer();
    }

    const handleDeletePreview = async (tempIndex: number) => {
        const check = previewList[tempIndex];
        const tempPreviews = previewList.filter((preview: any, index: number) => index !== tempIndex);
        await localStorage.setItem('preview', JSON.stringify(tempPreviews));

        if (JSON.stringify(check?.chat) == JSON.stringify(list)) {
            const newChat = { chat: [{ user: true, text: 'Hi! How Can I Help You?', date: new Date().toISOString() }] };
            tempPreviews?.push(newChat);
            localStorage.setItem('preview', JSON.stringify(tempPreviews));
            await setList(newChat.chat);
        } else {
            setAdd(previousValue => !previousValue);
        }
    }

    return (
        <Drawer open={open} onClose={closeDrawer} className="fixed z-20 dark:bg-black border-r-2 border-input dark:border-r-2 dark:border-dark">
            <div className="mb-2 flex items-center justify-between pr-4 border-input border-b-2 border-dashed dark:border-dark">
                <div className="flex lg:flex-1">
                    <img className="h-16 w-auto" src="" alt="" />
                </div>
                <svg onClick={() => closeDrawer()}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5 cursor-pointer dark:text-white text-secondary"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
            <div className="mt-auto w-full space-y-4 px-4 pt-4 mx-1">
                <button onClick={() => handleChat()}
                    className="flex w-full gap-x-2 rounded-lg border border-slate-300 p-4 text-left text-sm font-semibold text-secondary transition-colors dark:border-slate-700 dark:text-white"
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
            <div className="w-full py-5 px-3">
                <ul className="pl-2">
                    {previewList && previewList.length > 0 && previewList.map((item: any, index: number) =>
                    (item?.chat && item.chat?.length > 1 && <li
                        onClick={() => {
                            document.getElementById(`preview-action-mobile-${index}`).style.display = 'flex';
                            if (previouslySelectedPreview)
                                document.getElementById(previouslySelectedPreview).style.display = 'none';
                            setPreviouslySelectedPreview(`preview-action-mobile-${index}`);
                        }}
                        onBlur={() => {
                            console.log('ob blur called');
                            document.getElementById(`preview-action-mobile-${index}`).style.display = 'none';
                        }}
                        className="flex items-center text-secondary truncate dark:text-white/[0.6] font-sm pb-1 py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6 mr-2" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"></path><path d="M12 11l0 .01"></path>
                            <path d="M8 11l0 .01"></path><path d="M16 11l0 .01"></path>
                        </svg>
                        {item.chat[item.chat.length - 2]?.text}
                        <div id={`preview-action-mobile-${index}`} className='w-20 absolute right-0 inline-block justify-evenly bg-white dark:bg-black hidden'>
                            <svg className='pt-1 pl-2' onClick={() => setList(item?.chat)} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 42 32"><g fill="currentColor"><path d="M35.652 14.023a.5.5 0 0 0-.303.953C39.257 16.221 41 18.078 41 21c0 2.599-2.371 4.616-3.783 5.588A.5.5 0 0 0 37 27v3.823a7.953 7.953 0 0 1-3.126-2.155a.505.505 0 0 0-.468-.159c-.285.055-.576.133-.871.212c-.51.137-1.036.279-1.535.279c-2.568 0-4.366-.552-6.204-1.903a.5.5 0 0 0-.593.806C26.23 29.393 28.199 30 31 30c.631 0 1.223-.159 1.795-.313c.178-.049.355-.097.53-.138c1.869 1.974 3.983 2.423 4.075 2.441a.495.495 0 0 0 .416-.103A.498.498 0 0 0 38 31.5v-4.239c2.582-1.841 4-4.057 4-6.261c0-3.381-2.017-5.598-6.348-6.977z" /><path d="M33 13.5C33 5.804 25.982 0 16.677 0C7.325 0 0 5.931 0 13.502c0 4.539 3.211 7.791 6 9.759v6.636a.502.502 0 0 0 .705.456c.146-.065 3.559-1.616 6.479-4.809c1.265.235 2.696.461 3.994.461C26.641 26.005 33 20.979 33 13.5zM17.177 25.005c-1.31 0-2.799-.251-4.083-.496a.507.507 0 0 0-.468.159C10.576 26.98 8.167 28.449 7 29.082V23a.5.5 0 0 0-.217-.412C4.145 20.773 1 17.725 1 13.502C1 6.491 7.886 1 16.677 1C25.413 1 32 6.374 32 13.5c0 6.882-5.957 11.505-14.823 11.505z" /><path d="M16.5 11.5c-1.103 0-2 .897-2 2s.897 2 2 2s2-.897 2-2s-.897-2-2-2zm0 3a1.001 1.001 0 0 1 0-2a1.001 1.001 0 0 1 0 2zm7-3c-1.103 0-2 .897-2 2s.897 2 2 2s2-.897 2-2s-.897-2-2-2zm0 3a1.001 1.001 0 0 1 0-2a1.001 1.001 0 0 1 0 2zm-14-2.905c-1.103 0-2 .897-2 2s.897 2 2 2s2-.897 2-2s-.897-2-2-2zm0 3a1.001 1.001 0 0 1 0-2a1.001 1.001 0 0 1 0 2z" /></g></svg>

                            <svg onClick={() => { handleDeletePreview(index) }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 72 72"><path fill="#FFF" d="M51.76 17H20.153v37.65c0 4.06 3.29 5.62 7.35 5.62H44.41c4.06 0 7.35-1.56 7.35-5.62V17zM31 16v-4h10v4" /><path fill="#9B9B9A" d="M51 37v20.621L48.3 60H33z" /><path fill="#FFF" d="M17 16h38v4H17z" /><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M31 16v-4h10v4m10 9v31a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V25m-4-9h38v4H17zm24 12.25V55M31 28.25V55" />
                            </svg>
                        </div>
                    </li>
                    )
                    )}
                </ul>
            </div>
        </Drawer>
    );
}