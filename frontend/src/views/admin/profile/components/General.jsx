import Card from "components/card";
import React, { useState } from "react";
import { MdUnfoldMore, MdUnfoldLess, MdEdit, MdCable, MdSmartToy } from "react-icons/md";
// for cloud integration features
// import aws from '../../../../assets/img/cloudIntegrations/aws.png';
// import digitalOcean from '../../../../assets/img/cloudIntegrations/digital-ocean.png';

const General = (props) => {
  const [windowOpts, setWindowOpts] = useState(true)
  return (
    <Card extra={"w-full h-full p-4"}>
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
      <span className={`${!windowOpts ? 'hidden' : ''}`}>
        <div className="grid grid-cols-2 gap-4 px-2">
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">name</p>
            <p className="text-base font-medium text-navy-700 dark:text-white flex items-center">
              {props?.json?.name || (
                <>
                  <MdSmartToy className="text-blue-500 mr-1" />
                  No Name Provided
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Author</p>
            <p className="text-base font-medium text-navy-700 dark:text-white flex items-center">
              {props?.json?.author || (
                <>
                  <MdSmartToy className="text-blue-500 mr-1" />
                  No Author Provided
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">License</p>
            <p className="text-base font-medium text-navy-700 dark:text-white flex items-center">
              {props?.json?.license || (
                <>
                  <MdSmartToy className="text-blue-500 mr-1" />
                  No License Provided
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Version</p>
            <p className="text-base font-medium text-navy-700 dark:text-white flex items-center">
              {props?.json?.version || (
                <>
                  <MdSmartToy className="text-blue-500 mr-1" />
                  No Version Provided
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Cloud Integrations</p>
            {/* <p className="text-base font-medium text-navy-700 dark:text-white flex items-center">
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
            </p> */}
            <p className="text-base font-medium text-navy-700 dark:text-white flex items-center">
              <MdCable className="text-blue-500 mr-1" /> Future Feature
            </p>
          </div>
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Credentials</p>
            <p className="text-base font-medium text-navy-700 dark:text-white flex items-center">
              <MdCable className="text-blue-500 mr-1" /> Future Feature
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
