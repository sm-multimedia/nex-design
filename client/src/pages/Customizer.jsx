import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');

  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [downloadError, setDownloadError] = useState('');

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case "aipicker":
        return <AIPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          error={generationError}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  }

  const handleSubmit = async (type) => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setGenerationError('Please enter a prompt.');
      return;
    }

    try {
      setGeneratingImg(true);
      setGenerationError('');

      const environment = import.meta.env.DEV ? 'development' : 'production';
      const response = await fetch(config[environment].backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Image generation failed (${response.status}).`);
      }
      if (typeof data.photo !== 'string' || !data.photo) {
        throw new Error('The image service returned no image. Please try again.');
      }

      handleDecals(type, `data:image/png;base64,${data.photo}`);
      setActiveEditorTab('');
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : 'Image generation failed. Please try again.'
      );
    } finally {
      setGeneratingImg(false);
    }
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  const handleDownload = () => {
    try {
      downloadCanvasToImage();
      setDownloadError('');
    } catch (error) {
      setDownloadError(
        error instanceof Error ? error.message : 'Unable to download the shirt preview.'
      );
    }
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5 flex flex-col items-end gap-2"
            {...fadeAnimation}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="download-btn"
                onClick={handleDownload}
                aria-label="Download customized shirt"
                title="Download customized shirt"
              >
                <img src={download} alt="" className="w-2/3 h-2/3 object-contain" />
              </button>
              <CustomButton 
                type="filled"
                title="Go Back"
                handleClick={() => state.intro = true}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </div>
            {downloadError && (
              <p className="rounded bg-white/90 px-2 py-1 text-xs text-red-700" role="alert">
                {downloadError}
              </p>
            )}
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer