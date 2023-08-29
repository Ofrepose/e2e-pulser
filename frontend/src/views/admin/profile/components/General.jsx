import Card from "components/card";
import React, { useState } from "react";
import { MdUnfoldMore, MdUnfoldLess, MdEdit } from "react-icons/md";
import aws from '../../../../assets/img/cloudIntegrations/aws.png';
import digitalOcean from '../../../../assets/img/cloudIntegrations/digital-ocean.png';

const General = (props) => {
  const [windowOpts, setWindowOpts] = useState(true)
  return (
    <Card extra={"w-full h-full p-4"}>
      {/* Header */}
      <div className="mt-2 mb-2 w-full">

        <div className="relative flex items-center justify-between px-2">
          <div className="text-xl font-bold text-navy-700 dark:text-white flex items-center" >
            <span onClick={() => setWindowOpts((prev) => !prev)}>Project Details - {props?.projectName}</span> <MdEdit className="ml-1 cursor-pointer" />
          </div>
          <button className={`rounded-full text-xl`}  >
            <p className="text-2xl font-bold text-blue-500 dark:text-blue-500">
              <span onClick={() => setWindowOpts((prev) => !prev)}>{!windowOpts ? <MdUnfoldMore className="text-blue-500 mr-4" /> : <MdUnfoldLess className="text-blue-500 mr-4" />}</span>
            </p>
          </button>
        </div>


      </div>
      {/* Cards */}
      <span className={`${!windowOpts ? 'hidden' : ''}`}>
        <div className="grid grid-cols-2 gap-4 px-2">
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">name</p>
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {props?.json?.name}
            </p>
          </div>

          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Author</p>
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {props?.json?.author}
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">License</p>
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {props?.json?.license}
            </p>
          </div>

          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Version</p>
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {props?.json?.version}
            </p>
          </div>

          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Cloud Integrations</p>
            <p className="text-base font-medium text-navy-700 dark:text-white flex items-center">
              <img
                src={digitalOcean}
                alt="Digital Ocean"
                onClick={() => window.open(`https://docs.digitalocean.com/`, '_blank')}
                className="h-auto w-auto max-h-[33px] m-1 rounded-lg cursor-pointer" />
              <img
                src={aws}
                alt="aws"
                onClick={() => window.open(`https://docs.aws.amazon.com/`, '_blank')}
                className="h-auto w-auto max-h-[43px] m-1 rounded-lg cursor-pointer" />
            </p>

          </div>

          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Credentials</p>
            <p className="text-base font-medium text-navy-700 dark:text-white">
              Application Credentials: ✅
            </p>
            {/* <p className="text-base font-medium text-navy-700 dark:text-white">
              Cloud Credentials: ✅ ❌
            </p> */}
          </div>


        </div>
      </span>
    </Card>
  );
};

export default General;
