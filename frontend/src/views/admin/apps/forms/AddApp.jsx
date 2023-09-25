
import React, { useState } from 'react';
import InputField from "components/fields/InputField";
import { useProject } from '../../../../contexts/projects/ProjectContext';

// TODO: these forms could probably use YUP or some other form validator.

export default function AddApp({ edit, data, setActiveProject }) {
  const { addApplication, editApplication, isLoading, status, deleteApplication } = useProject();
  const isEditing = edit;
  const [formError, setFormError] = useState({})
  const [deletePrompt, setDeletePrompt] = useState('💣 Delete 💥')
  const [formData, setFormData] = useState(isEditing ?
    {
      projectName: data.projectName,
      tech: 'React|Node',
      url: data?.url,
      json: data?.json,
      git: data?.json?.jsonLocation !== 'file' ? data.json.jsonLocation : '',
      projectId: data._id,
    }
    :
    {
      projectName: '',
      tech: 'React|Node',
      url: '',
      json: '',
      git: '',
    }
  );


  const handleDelete = async (e) => {
    setActiveProject(() => null);
    deleteApplication({ projectId: data._id });
  }


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.json) {
      setFormData(prevData => ({ ...prevData, json: prevData.git }));
    }
    setFormData((prev) => prev);
    if (formData.json) {
      if (!isEditing) {
        addApplication(formData);
      } else {
        editApplication(formData);
      }
    }

  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        try {
          const parsedContent = JSON.parse(fileContent); // Parse the JSON content
          setFormData({ ...formData, json: parsedContent })
        } catch (error) {
          console.error('Error parsing JSON:', error);
          setFormError((prev) => ({ ...prev, json: 'Error parsing JSON' }))
        }
      };
      reader.readAsText(selectedFile);
      setFormError((prev) => {
        const { json, ...rest } = prev;
        return rest;
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="my-10 flex flex-col md:flex-row justify-center items-stretch gap-10" >
      <div className="w-full md:max-w-[420px]">
        {/* App Name */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="App Name*"
          placeholder="⏱ You've Launched Too Late.io"
          id="projectName"
          type="text"
          value={formData.projectName}
          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
        />

        {/* App Url */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="App Url"
          placeholder="🤷 This is the most optional option of the options"
          id="url"
          type="text"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />

        {/* Tech */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Technology|Stack*"
          placeholder="Only React | Node right now. This is MVP."
          id="tech"
          type="text"
          value="React|Node"
          onChange={(e) => handleFileChange({ ...formData, tech: e.target.value })}
        />
        <p className="mb-2 ml-1 text-base text-gray-400">
          Only React | Node right now. This is MVP. Stop yelling at me, I'm fragile.
        </p>




      </div>

      <div className="w-full md:max-w-[420px]">


        {/* json */}
        <InputField
          variant="auth"
          extra={formError.json ? 'mb-1' : 'mb-2'}
          label="Package.json*"
          placeholder="🍔 Gimme"
          id="package"
          type="file"
          accepts=".json"
          onChange={handleFileChange}
        />
        {formError.json && (
          <div className='text-red-600 text-bold ml-1'>{formError.json}</div>
        )}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Github link to your package.json raw.*"
          placeholder="🍔 Gimme that Github"
          id="package"
          type="text"
          value={formData.git}
          onChange={(e) => setFormData({ ...formData, git: e.target.value })}
        />
        <p className="mt-2 ml-1 text-base text-gray-600">
          Either the Package.json or the github link is required. <br />
          Your choice, really make this decision your own.
        </p>

        {isEditing && (
          <button
            className={`linear mt-10 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-400 dark:bg-red-500 dark:text-white dark:hover:bg-red-400 dark:active:bg-brand-200 ${isLoading === true
              ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
              : "border-gray-200 dark:!border-white/10 dark:text-white"
              }`}
            disabled={isLoading}
            type='button'
            onClick={() => {
              deletePrompt === '💣 Delete 💥' ? setDeletePrompt(() => 'You sure you want to delete this application?') : handleDelete()
            }}
          >
            {deletePrompt}
          </button>
        )}

        <button
          className={`linear mt-4 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 ${isLoading || Object.keys(formError).length
            ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            : "border-gray-200 dark:!border-white/10 dark:text-white"
            }`}
          disabled={isLoading || Object.keys(formError).length}
        >
          {isEditing ? 'So let it be rewritten' : 'So let it be written'}
        </button>

        {/* Success or Failure Message */}
        {status === "Success" ? (
          <div className="text-xl font-bold text-green-700 dark:text-green mt-2">

          </div>
        ) : status === "Failure" ? (
          <div className="text-xl font-bold text-red-700 dark:text-red mt-2">
            FAILED
          </div>
        ) : (
          <p className="mt-2 ml-1 text-base text-gray-600">
            Make sure all fields are included. <br />
            Or your app might go 💥 ( not really )
          </p>
        )}
      </div>
    </form>


  )
}