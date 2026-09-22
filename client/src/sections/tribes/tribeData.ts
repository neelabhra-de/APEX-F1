import ferrariImage from '../../assets/tribes/ferrari-tifosi.png'
import mclarenImage from '../../assets/tribes/mclaren-orange-army.png.png'
import mercedesImage from '../../assets/tribes/mercedes-silver-arrows.png'
import redbullImage from '../../assets/tribes/redbull-fans.png'

export type Tribe = {
  number: string
  title: string
  location: string
  copy: string
  atmosphere: string
  color: string
  colorSoft: string
  className: string
  image: string
  imagePosition: string
}

export const tribes: readonly Tribe[] = [
  {
    number: '01',
    title: 'Tifosi dreams',
    location: 'Maranello / Italia',
    copy: 'A red flag in the grandstand is never just fabric. It is inheritance, held high.',
    atmosphere: 'Rosso / devotion / Sunday',
    color: '#dd1b27',
    colorSoft: '#64141d',
    className: 'tifosi',
    image: ferrariImage,
    imagePosition: 'center center',
  },
  {
    number: '02',
    title: 'Orange army',
    location: 'Woking / Worldwide',
    copy: 'A new noise fills the old places. Young, bright and impossible to ignore.',
    atmosphere: 'Papaya / volume / tomorrow',
    color: '#ff7a18',
    colorSoft: '#703212',
    className: 'orange',
    image: mclarenImage,
    imagePosition: 'center center',
  },
  {
    number: '03',
    title: 'Silver arrows',
    location: 'Brackley / Precision',
    copy: 'The calm before lights out. A tribe that finds beauty in every measured detail.',
    atmosphere: 'Graphite / control / intent',
    color: '#c5d1d5',
    colorSoft: '#3d4a50',
    className: 'silver',
    image: mercedesImage,
    imagePosition: 'center center',
  },
  {
    number: '04',
    title: 'Red Bull fans',
    location: 'Milton Keynes / Motion',
    copy: 'The grandstand moves first. Energy becomes colour, colour becomes a roar.',
    atmosphere: 'Blue / voltage / no brakes',
    color: '#4d76db',
    colorSoft: '#172b65',
    className: 'redbull',
    image: redbullImage,
    imagePosition: 'center center',
  },
]
