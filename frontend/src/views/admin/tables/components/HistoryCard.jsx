import React, { useEffect, useState } from "react";
import { MdArrowBack, MdArrowForward, MdClose, MdModeEditOutline } from "react-icons/md";
import altImage from "assets/img/profile/alt.webp";
import Card from "components/card";
import { v4 as uuidv4 } from "uuid";

import { useAuth } from "contexts/user/AuthContext";

const API = 'http://localhost:5005/api/users/';

const HistoryCard = (props) => {
    const { getImages } = useAuth();
    const [images, setImages] = useState([]);
    const [imageInfo, setImageInfo] = useState();

    return (
        <Card extra={`w-full p-2 h-full overflow-y-auto shadow-3xl shadow-shadow-800 dark:!bg-navy-700 dark:shadow-none ${images.length ? '' : ''}`}>
            <div className={`flex justify-end w-full h-full `}>

                <div className={`pb-4 pr-2 ${images.length ? 'border-r border-gray-200' : ''}`} >
                    {images.length ?
                        <>
                            <div className="relative flex items-center justify-end px-2 w-full">
                                <MdClose onClick={() => setImages(prev => [])} className="text-blue-500 mr-4 text-2xl cursor-pointer" />
                            </div> {imageInfo}
                        </> : ''

                    }
                    <div className={`w-half ${images.length ? 'h-full flex flex-wrap w-full items-start content-start' : ''}`} key={uuidv4()}>
                        {images?.map((item) => (
                            <div key={uuidv4()} className="relative shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                <img
                                    className="h-auto w-auto max-h-[253px] m-1 rounded-lg cursor-pointer shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
                                    src={`${API}image/${item}`}
                                    alt=""
                                    onClick={() => window.open(`${API}image/${item}`, '_blank')}
                                    key={uuidv4()}
                                />
                                {/* <div className="absolute bottom-0 left-0 w-full p-2 bg-opacity-70 text-black rounded-bl-lg">
                                Your Caption Here
                            </div> */}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`w-half`}>
                    <span className='flex justify-end'><MdArrowForward onClick={props.closeInfo} className="text-blue-500 mr-4 text-2xl cursor-pointer" /></span>
                    <div className="relative flex items-center justify-between pt-4 px-2">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                            {props.title}
                        </div>
                    </div>
                    <div className="mb-8 w-full px-2">
                        <p className="mt-2 text-base text-gray-600 max-w-sm">
                            {props.highlight}
                        </p>
                    </div>
                    {props?.runs?.map((item) => (
                        <div key={uuidv4()} className={`flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none`}>
                            <div className="flex items-center">
                                <div className="">
                                    <img className="h-[83px] w-[83px] rounded-lg cursor-pointer"
                                        src={item?.screenshots?.length ? `${API}image/${item?.screenshots[0] || ''}` : altImage}
                                        alt=""
                                        onClick={() => {
                                            if (item?.screenshots?.length) {
                                                setImages(prev => item?.screenshots)
                                            }
                                            setImageInfo((prev) => <div className="ml-4">
                                                <p className="mt-2 text-sm text-gray-600 mr-1">
                                                    {(() => {
                                                        const date = new Date(item.runTime);
                                                        const convertedDate = date?.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })
                                                        return convertedDate
                                                    })()}
                                                </p>
                                                {item.passed ? (
                                                    <p className="text-base font-medium text-green-700 dark:text-green">
                                                        Passed
                                                    </p>
                                                ) : (
                                                    <p className="text-base font-medium text-red-700 dark:text-red">
                                                        Failed
                                                    </p>
                                                )}
                                                <div className="flex">
                                                    <p className="mt-2 text-sm text-gray-600 mr-1">
                                                        Errors:
                                                    </p>
                                                    {item.error ? (
                                                        <p className="mt-2 text-sm text-red-600 max-w-sm overflow-x-hidden">
                                                            {item.error}
                                                        </p>
                                                    ) : (
                                                        <p className="mt-2 text-sm text-green-600">
                                                            None
                                                        </p>
                                                    )}
                                                </div>
                                            </div>)
                                        }} />
                                </div>
                                <div className="ml-4">
                                    <p className="mt-2 text-sm text-gray-600 mr-1">
                                        {(() => {
                                            const date = new Date(item.runTime);
                                            const convertedDate = date?.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })
                                            return convertedDate
                                        })()}
                                    </p>
                                    {item.passed ? (
                                        <p className="text-base font-medium text-green-700 dark:text-green">
                                            Passed
                                        </p>
                                    ) : (
                                        <p className="text-base font-medium text-red-700 dark:text-red">
                                            Failed
                                        </p>
                                    )}
                                    <div className="flex">
                                        <p className="mt-2 text-sm text-gray-600 mr-1">
                                            Errors:
                                        </p>
                                        {item.error ? (
                                            <p className="mt-2 text-sm text-red-600 max-w-sm overflow-x-hidden">
                                                {item.error}
                                            </p>
                                        ) : (
                                            <p className="mt-2 text-sm text-green-600">
                                                None
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>

    );
};

export default HistoryCard;
