import countries from 'i18n-iso-countries'
import frLocale from 'i18n-iso-countries/langs/fr.json'

countries.registerLocale(frLocale)

export const useCountries = () => {
  const getCountryList = () =>
    Object.entries(countries.getNames('fr')).map(([code, name]) => ({
      code,
      name
    }))

  const getCountryName = (code: string) => countries.getName(code, 'fr')
  const getCountryCode = (name: string) => countries.getAlpha2Code(name, 'fr')

  return { getCountryList, getCountryName, getCountryCode }
}

export default defineNuxtPlugin(() => {})