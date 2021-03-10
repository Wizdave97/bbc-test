import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import App from './App';

const hero_title_hindi = 'भारत: इस हफ़्ते आपने आपने कितनी सिगरेट पी हैं?'
const cigg_delhi = 'You smoke 10 ciggrettes daily'
describe('<App/>', () => {
  it('should render correctly', async () => {
    render(<App/>)

    await waitFor(() => expect(document.querySelectorAll('p')).toHaveLength(10))

    await waitFor(async () => expect(await screen.findByTestId('lang-dropdown')).toBeInTheDocument())
    await waitFor(async () => expect(await screen.findByTestId('city-dropdown')).toBeInTheDocument())
  })

  it('should change  language', async () => {
    render(<App/>)

    const lang = await screen.findByTestId('lang-dropdown')

    fireEvent.click(lang)

    const hindi = await screen.findByText('Hindi')

    fireEvent.click(hindi)

    await waitFor(async () => expect(await screen.findByText(hero_title_hindi)).toBeInTheDocument())
  })

  it('should change  city', async () => {
    render(<App/>)

    const lang = await screen.findByTestId('city-dropdown')

    fireEvent.click(lang)

    const delhi = await screen.findByText('Delhi')

    fireEvent.click(delhi)

    await waitFor(async () => expect(await screen.findByText(cigg_delhi)).toBeInTheDocument())
  })
})