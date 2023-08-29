
import React, { useState } from 'react';
import InputField from "components/fields/InputField";
import { useTestProvider } from '../../../../contexts/tests/TestContext';
import { MdAddCircleOutline } from 'react-icons/md';
import { v4 as uuidv4 } from "uuid";

export default function AddTest(props) {
    const testOptions = ['Can see text on page', 'Can log in', 'Custom Form'];
    const identiferOptions = ['name', 'placeholder', 'type', 'customAttribute', 'id', 'class'];

    const { addTest, isLoading } = useTestProvider();
    const { activeTest } = props;

    const [type, setType] = useState(activeTest?.testType || testOptions[0]);
    const [formData, setFormData] = useState({
        projectId: props.activeProjectId,
        testType: activeTest?.testType || testOptions[0],
        testName: activeTest?.name || '',
        testId: activeTest?._id || '',
        editing: !!activeTest?.editing || false,
        data: {
            targetUrl: activeTest?.args?.targetUrl || '',
            targetText: activeTest?.args?.targetText || '',
            inputNameForUserName: activeTest?.args?.inputNameForUserName || '',
            userNameForTest: activeTest?.args?.userNameForTest || '',
            p_forTest: activeTest?.args?.p_forTest || '',
            inputNameForPassword: activeTest?.args?.inputNameForPassword || '',
            customAttributes: activeTest?.args?.customAttributes || []

        }
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        addTest(formData);

    };

    const handleTestTypeChange = (e) => {
        setFormData({ ...formData, testType: e.target.value });
        setType(prev => e.target.value)
    }

    const handleIdentifierSelect = (formid, e) => {
        const updatedAttribute = { identifierKey: e.target.value };
        updateCustomAttribute(formid, updatedAttribute);
    };

    const updateCustomAttribute = (formFieldId, updatedAttribute) => {
        setFormData(prevFormData => {
            const updatedCustomAttributes = prevFormData.data.customAttributes.map(attr =>
                attr.formFieldId === formFieldId ? { ...attr, ...updatedAttribute } : attr
            );

            return {
                ...prevFormData,
                data: {
                    ...prevFormData.data,
                    customAttributes: updatedCustomAttributes,
                },
            };
        });
    };

    const handleAddCustom = () => {
        const formid = uuidv4();

        const newAttData = {
            formFieldId: formid,
            identifierKey: '',
            identifierValue: '',
            value: '',
        };

        setFormData(prevFormData => {
            const updatedCustomAttributes = [...prevFormData.data.customAttributes, newAttData];

            return {
                ...prevFormData,
                data: {
                    ...prevFormData.data,
                    customAttributes: updatedCustomAttributes,
                },
            };
        });
    };

    return (

        <form onSubmit={handleSubmit} className="my-10 flex flex-col justify-center items-center gap-10" >

            {/* Centered Dropdown Selector */}
            <div className="w-full max-w-[420px] text-center">
                <label htmlFor="test" className='text-sm text-navy-700 dark:text-white'>
                    Select Test*
                </label>
                <select
                    id="test"
                    name="test"
                    className='mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none'
                    value={formData.testType}
                    onChange={handleTestTypeChange}
                    color='black'
                >
                    {testOptions.map((option) => (
                        <option
                            key={option}
                            value={option}
                            className={`text-black`}
                            color='black'
                        >
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {type === testOptions[0] ? (
                <span className="w-full max-w-[840px] grid grid-cols-2 gap-10">
                    <div className="w-full md:max-w-[420px]">
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Test Name*"
                            placeholder="🔍 Identify this test"
                            id="testName"
                            type="text"
                            value={formData.testName}
                            onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                        />

                        {/* Tech */}
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Target Text*"
                            placeholder="🎯 Text to test for"
                            id="targetText"
                            type="text"
                            value={formData.data.targetText}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, targetText: e.target.value } })}
                        />
                        <p className="mt-2 ml-1 text-base text-gray-600">
                            This test can be used to find unique text on a page <br />
                            Also, here's a penguin. 🐧
                        </p>




                        <p className="mt-2 ml-1 text-base text-gray-600">
                            😬 This is case sensitive, like me. <br />
                        </p>





                    </div>

                    <div className="w-full md:max-w-[420px]">


                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Target Url"
                            placeholder="🤷 Page to check for text"
                            id="targetUrl"
                            type="text"
                            value={formData.data.targetUrl}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, targetUrl: e.target.value } })}
                        />
                        <p className="mb-2 ml-1 text-base text-gray-400">
                            Make sure this url is not auth protected. <br />
                            Use the 'Auth - Text find' test for that.
                        </p>

                    </div>
                </span>
            ) : type === testOptions[1] ? (
                <span className="w-full max-w-[840px] grid grid-cols-2 gap-10">
                    <div className="w-full md:max-w-[420px]">
                        {/* App Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Test Name*"
                            placeholder="🔍 Identify this test"
                            id="testName"
                            type="text"
                            value={formData.testName}
                            onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                        />

                        {/* App Url */}
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Target Url"
                            placeholder="🤷 Log in page address"
                            id="targetUrl"
                            type="text"
                            value={formData.data.targetUrl}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, targetUrl: e.target.value } })}
                        />

                        {/* Tech */}
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Target Text*"
                            placeholder="Text to test for after logging in"
                            id="targetText"
                            type="text"
                            value={formData.data.targetText}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, targetText: e.target.value } })}
                        />
                        <p className="mt-2 ml-1 text-base text-gray-600">
                            Here's another penguin 🐧
                        </p>




                    </div>

                    <div className="w-full md:max-w-[420px]">


                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Username to log in*"
                            placeholder="🔐 creds to log in"
                            id="package"
                            type="text"
                            value={formData.data.userNameForTest}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, userNameForTest: e.target.value } })}
                        />

                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Identifier used in the input name*"
                            placeholder="🔤 ie: username"
                            id="package"
                            type="text"
                            value={formData.data.inputNameForUserName}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, inputNameForUserName: e.target.value } })}
                        />
                        <p className="mb-2 ml-1 text-sm text-gray-600">
                            {'<input name="inputFieldIdentifier" />'} ⤴ would be inputFieldIdentifier
                        </p>

                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Password to log in*"
                            placeholder="🔑 the other part of logging in"
                            id="package"
                            type="text"
                            value={formData.data.p_forTest}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, p_forTest: e.target.value } })}
                        />
                        <p className="mb-2 ml-1 text-sm text-gray-600">
                            This should be a limited user made for testing purposes. <br />
                            This will be encrypted on the backend but like...barely.
                        </p>

                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Identifier used in the input password*"
                            placeholder="🔤 ie: p_word"
                            id="package"
                            type="text"
                            value={formData.data.inputNameForPassword}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, inputNameForPassword: e.target.value } })}
                        />
                        <p className="mb-2 ml-1 text-sm text-gray-600">
                            {'<input name="inputFieldIdentifier" />'} ⤴ would be inputFieldIdentifier
                        </p>

                    </div>
                </span>
            ) : type === testOptions[2] ? (
                <span className="w-full max-w-[840px] grid grid-cols-2 gap-10">
                    <div className="w-full md:max-w-[420px]">
                        {/* App Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Test Name*"
                            placeholder="🔍 Identify this test"
                            id="testName"
                            type="text"
                            value={formData.testName}
                            onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                        />

                        {/* App Url */}
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Target Url"
                            placeholder="🤷 Form page address"
                            id="targetUrl"
                            type="text"
                            value={formData.data.targetUrl}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, targetUrl: e.target.value } })}
                        />

                        {/* Tech */}
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Target Text*"
                            placeholder="Text to test for after submitting form"
                            id="targetText"
                            type="text"
                            value={formData.data.targetText}
                            onChange={(e) => setFormData({ ...formData, data: { ...formData.data, targetText: e.target.value } })}
                        />
                        <p className="mt-2 ml-1 text-base text-gray-600">
                            Here's another penguin 🐧
                        </p>




                    </div>

                    <div className="w-full md:max-w-[420px]">

                        {
                            formData?.data?.customAttributes.map((item) => {
                                return <div key={`custom-${item.formFieldId}`} className='bg-blue-50 dark:bg-navy-900 p-1 mb-4'>
                                    <label
                                        htmlFor="test"
                                        className="text-sm text-navy-700 dark:text-white"
                                        key={item.formFieldId}
                                    >
                                        Select Input field identifier*
                                    </label>
                                    <select
                                        id="test"
                                        name="test"
                                        formid={item.formFieldId}
                                        className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-color:black bg-white/0 p-3 text-sm outline-none"
                                        value={formData.data.customAttributes[formData.data.customAttributes.findIndex(i => i.formFieldId === item.formFieldId)]?.identifierKey}
                                        onChange={(e) => handleIdentifierSelect(item.formFieldId, e)}
                                        color="black"
                                    >
                                        {identiferOptions.map((option) => (
                                            <option
                                                key={option}
                                                value={option}
                                                className="text-black"
                                                color="black"
                                            >
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mb-2 ml-1 text-sm text-gray-600">
                                        Example Identifier key: For {'<input name="inputFieldIdentifier" />'} identifier would be 'name'
                                    </p>


                                    <InputField
                                        variant="auth"
                                        extra="mb-1"
                                        label="Identifier Value*"
                                        placeholder="Value for this identifier"
                                        id="idvalue"
                                        formid={item.formFieldId}
                                        type="text"
                                        value={formData.data.customAttributes[formData.data.customAttributes.findIndex(i => i.formFieldId === item.formFieldId)]?.identifierValue}
                                        onChange={(e) => {
                                            const updatedAttribute = { identifierValue: e.target.value };
                                            updateCustomAttribute(item.formFieldId, updatedAttribute);
                                        }}
                                    />
                                    <p className="mb-2 ml-1 text-sm text-gray-600">
                                        Example Identifier value: For {'<input name="inputFieldIdentifier" />'} identifier would be 'inputFieldIdentifier'
                                    </p>

                                    <InputField
                                        variant="auth"
                                        extra="mb-1"
                                        label="Field Value*"
                                        placeholder="Value for this Field"
                                        id="idfield"
                                        formid={item.formFieldId}
                                        type="text"
                                        value={formData.data.customAttributes[formData.data.customAttributes.findIndex((i) => i.formFieldId === item.formFieldId)]?.value}
                                        onChange={(e) => {
                                            const updatedAttribute = { value: e.target.value };
                                            updateCustomAttribute(item.formFieldId, updatedAttribute);
                                        }}
                                    />
                                    <p className="mb-2 ml-1 text-sm text-gray-600">
                                        Example value email field: For {'<input name="email" />'} could be 'test@test.com'
                                    </p>
                                </div>
                            })
                        }

                        <span onClick={handleAddCustom} className='flex justify-start text-blue-500 items-center cursor-pointer'>
                            <MdAddCircleOutline className="text-blue-500 mr-1" />
                            <div>Add Field</div>
                        </span>

                    </div>
                </span>
            ) : <></>}
            <>
                <button
                    className={`linear mt-10 w-half px-5 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 ${isLoading === true || 
                        !formData.testName || 
                        !formData.testType ||
                        !formData.data.targetText
                        ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
                        : "border-gray-200 dark:!border-white/10 dark:text-white"
                        }`}
                    disabled={isLoading || !formData.testName || !formData.testType || !formData.data.targetText}
                >
                    {formData?.editing ? 'Save' : 'Add Test'}
                </button>
            </>
        </form>


    )
}