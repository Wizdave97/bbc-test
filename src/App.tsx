import React, { useCallback, useEffect, useState } from 'react';
import UserIcon from './assets/user.svg'
import dataEnglish from './data/english.json'
import dataHindi from './data/hindi.json'
import { Dropdown } from 'semantic-ui-react'
import CiggIcon from './img/ciggrette_icon.png'


enum LANGUAGE {
  ENGLISH = 'ENGLISH',
  HINDI = 'HINDI'
}
function App() {

  const [lang, setLang] = useState<LANGUAGE>(LANGUAGE.ENGLISH)
  const [paragraphs, setParagraphs] = useState<string[]>([])
  const [citiesData, setCitiesData] = useState<any>({})
  const [selectedCity, setSelectedCity] = useState<null | number>(null)
  const [options, setOptions] = useState<any>([])

  const dataToUse = React.useMemo(() => lang === LANGUAGE.ENGLISH ? dataEnglish : dataHindi, [lang])
  const getParagraphs = useCallback(() => {
    const keys = Object.keys(dataToUse)
    const paras = []
    for (let key of keys) {
      if (key.indexOf('p_') > -1) {
        paras.push(dataToUse[key as keyof typeof dataToUse])
      }
    }
    return paras
  }, [dataToUse])

  const getCitiesData = useCallback(() => {
    const totalCities = Number(dataToUse?.total_cities_1_value)
    const cityData = []
    const options = []
    for (let i = 1; i <= totalCities; i++) {
      const city: { [key: string]: string } = {}
      const name = dataToUse[`compare-tabs_1_city_${i}_name` as keyof typeof dataToUse]
      city.name = name
      city.aqi = dataToUse[`compare-tabs_1_city_${i}_aqi` as keyof typeof dataToUse]
      city.cigg = dataToUse[`compare-tabs_1_city_${i}_cigg` as keyof typeof dataToUse]
      cityData.push(city)
      options.push({ value: i - 1, text: name, key: name })
    }
    return [options, cityData]
  }, [dataToUse])

  const pmToMilliGrams = (val: string) => {
    const [num] = val.split(' ')
    const milli = +num * 15

    return milli
  }
  useEffect(() => {
    const paragraphs = getParagraphs()
    setParagraphs(paragraphs)
  }, [getParagraphs])

  useEffect(() => {
    const [options, data] = getCitiesData()
    setCitiesData(data)
    setOptions(options)
  }, [getCitiesData])

  return (
    <div className="w-full min-h-full bg-gray-100 flex flex-col">
      <div className="w-full h-100 bg-hero bg-no-repeat bg-cover flex justify-left items-center  p-8 sm:px-10 md:px-24 lg:px-32 sm:py-16 md:py-24 lg:py-32 xl:px-56 xl:py-48">
        <h1 className='text-white text-5xl w-full xl:w-9/12 lg:text-6xl xl:text-8xl font-bolder'>{dataToUse?.hero_1_title}</h1>
      </div>
      <div className='w-full my-6 flex flex-row justify-end p-8 sm:px-10 md:px-24 lg:px-32 xl:px-56'>
        <h3 className='text-md font-bold text-gray-700 mr-4'>Select language</h3>
        <Dropdown
          data-testid='lang-dropdown'
          value={lang}
          options={[
            { value: LANGUAGE.ENGLISH, text: 'English', key: LANGUAGE.ENGLISH },
            { value: LANGUAGE.HINDI, text: 'Hindi', key: LANGUAGE.HINDI }]}
          onChange={(_, { value }) => setLang(value as LANGUAGE)}
        />
      </div>
      <div className='w-full flex flex-col p-8 sm:px-10 md:px-24 lg:px-32 sm:py-10 md:py-16 lg:py-20 xl:px-56 xl:py-24'>
        <div className='w-full flex flex-row items-center justify-between my-8'>
          <section className='flex flex-row items-center'>
            <img src={UserIcon} alt='' className='w-16 h-16' />
            <div className='mx-6 flex flex-col'>
              <h3 className='my-2'>{dataToUse?.['article-info_1_byline']}</h3>
              <span className='my-2'>{dataToUse?.['article-info_1_date']}</span>
            </div>
          </section>
          <section className='flex flex-col'>
            <span className='text-md font-bold my-2'>{dataToUse?.['article-info_1_category']}</span>
            <a href={dataToUse?.['article-info_1_category_url']} className='no-underline my-2'>Explore</a>
          </section>
        </div>
        <article className='w-full flex flex-col my-8'>
          <p className='text-md  my-2'>{paragraphs?.[0] ?? ''}</p>
          <p className='text-md  my-2'>{paragraphs?.[1] ?? ''}</p>
          <p className='text-md  my-2'>{paragraphs?.[2] ?? ''}</p>
          <p className='text-md  my-2'>{paragraphs?.[3] ?? ''}</p>
          <p className='text-md  my-2'>{paragraphs?.[4] ?? ''}</p>
          <section className='w-full flex flex-col my-16'>
            <h3 className='my-2 font-bold text-md mb-6'>{dataToUse?.['compare-tabs_1_method']}</h3>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-8 border rounded-md p-8'>
              <div className='flex flex-col'>
                <h4 className='my-2 font-bold text-md'>{dataToUse?.['compare-tabs_1_title']}</h4>
                <Dropdown data-testid='city-dropdown' className='w-full text-md my-3' value={selectedCity as number} search options={options} placeholder={dataToUse?.['compare-tabs_1_title']} onChange={(_, { value }) => setSelectedCity(value as number)} />
              </div>

              <div className='flex flex-col'>
                {
                  (selectedCity !== null) && (
                    <>
                      <h4 className='w-full mb-4  text-xl text-gray-700'>{lang === LANGUAGE.ENGLISH ? 'Living in' : 'में रहने वाले'} {citiesData[selectedCity]?.name}?</h4>
                      <div className='flex flex-row items-center'>
                        <div className='w-16 h-16 mr-6 overflow-hidden'>
                          <img className='w-full h-full' src={CiggIcon} alt='ciggrette icon' />
                        </div>
                        <span className='text-xl text-gray-700'>{lang === LANGUAGE.ENGLISH ? `You smoke ${citiesData?.[selectedCity]?.cigg} ciggrettes daily` : `आप रोजाना ${citiesData?.[selectedCity]?.cigg} सिगरेट पीते हैं`}</span>
                      </div>
                      <div className='flex flex-row items-center my-3'>
                        <span className='text-2xl text-gray-700'>{lang === LANGUAGE.ENGLISH ? `Your air quality is ` : `आपकी हवा की गुणवत्ता है `} {citiesData?.[selectedCity]?.aqi} ({pmToMilliGrams(citiesData?.[selectedCity]?.aqi)} µg/m3)</span>
                      </div>
                    </>
                  )
                }
              </div>
            </div>
          </section>
          <p className='text-md  my-2'>{paragraphs?.[5] ?? ''}</p>
          <p className='text-md  my-2'>{paragraphs?.[6] ?? ''}</p>
          <p className='text-md  my-2'>{paragraphs?.[7] ?? ''}</p>
          <p className='text-md  my-2'>{paragraphs?.[8] ?? ''}</p>
          <p className='text-md  my-2'>{paragraphs?.[9] ?? ''}</p>
        </article>
      </div>

    </div>
  );
}

export default App;
