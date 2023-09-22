import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import { MdCheckCircle, MdAddCircleOutline, MdArrowBack, MdUnfoldLess, MdUnfoldMore, MdClose, MdEdit } from "react-icons/md";
import React, { useState, useEffect } from "react";
import AddTest from "views/admin/apps/forms/AddTest";
import { useTestProvider } from "contexts/tests/TestContext";
import { Tooltip } from "@chakra-ui/tooltip";

const TestingTable = (props) => {
    const { columnsData, tableData, activeProjectId } = props;
    const [windowOpts, setWindowOpts] = useState(true)
    const [cardState, setCardState] = useState('default');
    const { runSingle, isLoading, isTesting, info, clearInfo, runAll } = useTestProvider();
    const [activeTest, setActiveTest] = useState();
   

    return (
        <Card extra={"w-full h-full p-4"}>
            {
                cardState === 'default' ? (
                    <>
                        <div className="relative flex items-center justify-between px-2">
                            <div className="text-xl font-bold text-navy-700 dark:text-white" onClick={() => setWindowOpts((prev) => !prev)}>
                                {props?.dataTitle} <span className="text-sm text-gray-600">({tableData.length})</span>
                            </div>
                            <button className={`rounded-full text-xl`}  >
                                <p className="text-2xl font-bold text-blue-500 dark:text-blue-500 flex justify-end">
                                    <MdAddCircleOutline onClick={() => setCardState('add')} className="text-blue-500 mr-4" />
                                    <span onClick={() => setWindowOpts((prev) => !prev)}>{!windowOpts ? <MdUnfoldMore className="text-blue-500 mr-4" /> : <MdUnfoldLess className="text-blue-500 mr-4" />}</span>
                                </p>
                            </button>


                        </div>

                        <div className={`h-full overflow-x-scroll bg-black-500 xl:overflow-x-hidden ${!windowOpts ? 'hidden' : ''}`}>
                            <table className="mt-8 h-max w-full" variant="simple" color="gray-500" mb="24px">
                                <thead>
                                    <tr>
                                        {columnsData.map((column, index) => {
                                            if (column.Header === 'RUN ALL') {
                                                return (
                                                    <th
                                                        key={index}
                                                        className="border-b border-gray-200 pr-3 pb-[10px] text-start dark:!border-navy-700 "
                                                    >
                                                        <div className="text-xs font-bold tracking-wide text-gray-600 cursor-pointer"
                                                            onClick={isTesting.length ? () => { } : () => runAll({ projectId: activeProjectId, tests: tableData.map(item => item.name) })}
                                                        >

                                                            {
                                                                isTesting.length ?
                                                                    (<span className='text-gray-200 dark:text-gray-200'>{column.Header}<span className='text-lg'>👽</span></span>)
                                                                    : <span className='text-gray-600'>{column.Header} <span className='text-lg'>☄️</span></span>
                                                            }
                                                        </div>
                                                    </th>
                                                )
                                            } else {
                                                return (
                                                    <th
                                                        key={index}
                                                        className="border-b border-gray-200 pr-32 pb-[10px] text-start dark:!border-navy-700 "
                                                    >
                                                        <div className="text-xs font-bold tracking-wide text-gray-600">
                                                            {column.Header}
                                                        </div>
                                                    </th>
                                                )
                                            }
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((row, index) => (
                                        <tr key={index} className={`pl-2 ${isTesting.includes(row.name) ? 'bg-blue-100 dark:bg-navy-900' : ''}`}>
                                            {columnsData.map((column, columnIndex) => {
                                                let data = (
                                                    <p className={`text-sm font-medium text-navy-700 dark:text-white pl-2`}>
                                                        {row[column.accessor]}
                                                    </p>
                                                );
                                                if (column.Header === "UPDATE") {
                                                    data = (
                                                        <div className="flex items-center gap-3">
                                                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                                                                {row[column.accessor] ? (
                                                                    <button>Update</button>
                                                                ) : (
                                                                    <MdCheckCircle className="text-green-500" />
                                                                )}
                                                            </p>
                                                        </div>
                                                    );
                                                } else if (column.Header === "NAME") {
                                                    data = (
                                                        <p className={`text-sm font-medium text-navy-700 dark:text-white pl-2 flex align-center items-center`} >
                                                            <>
                                                           
                                                                <MdEdit 
                                                                className="mr-1 cursor-pointer"
                                                                onClick={() => {
                                                                    setCardState('add');
                                                                    setActiveTest({...row.raw, editing: true});
                                                                }}
                                                                />
                                                                {props.currentProjectTests ? (
                                                                    <Tooltip 
                                                                    label={
                                                                        props.currentProjectTests && `Tests if ${props?.currentProjectTests[index]?.args.targetText} is found on ${props?.currentProjectTests[index]?.args.targetUrl}` || ''
                                                                    }
                                                                    >
                                                                        {row[column.accessor]}
                                                                    </Tooltip>
                                                                ) : ''}
                                                                </>
                                                        </p>
                                                    );
                                                } else if (column.Header === "DESCRIPTION") {
                                                    data = (
                                                        <p className={`text-sm font-bold text-navy-700 dark:text-white bg-black`} >
                                                            {row[column.accessor]?.startsWith('<') ? '' : row[column.accessor]}
                                                        </p>
                                                    );
                                                } else if (column.Header === "LAST RUN") {
                                                    data = (
                                                        <p className={`text-sm font-bold text-navy-700 dark:text-white bg-black items-center align-center flex ${row?.passed ? 
                                                        'text-green-500 dark:text-green-500' : 
                                                        'text-red-400 dark:text-red-500'}`} >
                                                            {row[column.accessor]?.startsWith('Invalid Date') ? 
                                                            'Never' : 
                                                            `${row.passed ? '🌕 ' + row[column.accessor] : '💥 ' + row[column.accessor] }`}
                                                            <span className="cursor-pointer ml-1 items-center align-center" onClick={() => props.handleInfo(row.name)}>📖 </span>
                                                        </p>
                                                    );
                                                }
                                                else if (column.Header === "RUN") {
                                                    data = (
                                                        row[column.accessor] ? (<a className={`text-lg font-bold text-navy-700 dark:text-white bg-black text-center pl-2 cursor-pointer`}
                                                            onClick={() => runSingle({ projectId: activeProjectId, testName: row.name })}
                                                        >
                                                            {isTesting.includes(row.name) ? '👨‍🚀' : '🚀'}
                                                        </a>) : ''

                                                    );
                                                }
                                                return (
                                                    <td
                                                        key={columnIndex}
                                                        className="pt-[14px] pb-3 text-[14px]"
                                                    >
                                                        {data}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {info.length > 0 ? (
                                <div className="relative p-2 !bg-black">

                                    <div className="text-2xl font-bold text-blue-500 dark:text-blue-500 flex justify-between">
                                        <div className="text-base font-bold text-navy-700 dark:text-white py-2">
                                            Output:
                                        </div>
                                        <MdClose onClick={() => clearInfo()} className="text-blue-500 mr-4 cursor-pointer" />
                                    </div>
                                    <div className="w-full border-solid border-2 border-sky-500 !bg-black-500 py-2 px-1">
                                        {info?.map((item, idx) => {
                                            return item.statuses.map(status => {
                                                if (status.startsWith('TEST FAILED')) {
                                                    return <div className="text-red-500 dark:text-red-500 font-bold text-sm mb-2" key={status}>{status}</div>
                                                } else if (status.startsWith('TEST PASSED')) {
                                                    return <div className="text-green-500 dark:text-green-500 font-bold text-sm mb-2" key={status}>{status}</div>
                                                } else {
                                                    return <div className="text-navy-700 dark:text-white font-bold text-sm" key={status}>{status}</div>
                                                }
                                            })
                                        })}
                                        {isTesting.length ? <div className="animate-blinking">|</div> : <div className="text-navy-700 dark:text-white font-bold text-sm">Complete.</div>}
                                    </div>
                                </div>
                            ) : <></>}

                        </div>
                    </>
                ) :
                    (
                        <>
                            <div className="relative flex items-center justify-between pt-4 px-2">
                                <div className="text-xl font-bold text-navy-700 dark:text-white">
                                    Add Test:
                                </div>
                                <MdArrowBack 
                                onClick={()=>{
                                    setCardState('default')
                                    setActiveTest({});
                                }} className="text-blue-500 mr-4 text-2xl cursor-pointer" />

                            </div>
                            <AddTest
                                activeProjectId={activeProjectId}
                                activeTest={activeTest}
                                setActiveTest={setActiveTest}
                            />
                        </>
                    )
            }
        </Card>
    );
};

export default TestingTable;
