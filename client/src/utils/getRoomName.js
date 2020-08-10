const words = [
  [
    'The Heckin\'', // descriptors
    'Fluffy\'s',
    'Fuzzy\'s',
    'The Three-Legged',
    'Good Boi\'s',
    'Woof',
    'The Howlin\'',
    'The Vet\'s',
    'Canine\'s',
    'Old Yeller\'s',
    'Wolf\'s',
    'Lassie\'s',
    'Tramp\'s',
    'Marley\'s',
    'Beethoven\'s',
    'The Foxy',
    'Coyote',
    'Toto\'s',
    'The Runaway\'s',
    'Rottweiler',
    'Husky',
    'Dalmation',
    'Paw-paw\'s',
    'Airbud\'s',
    'Spot\'s',
  ],
  [
    'Pound', // places
    'Den',
    'House',
    'Hammock',
    'Yard',
    'Kennel',
    'Bowl',
    'Foxhole',
    'Pen',
    'Woods',
    'Junkyard',
    'Lounge',
    'Basement',
    'Crib',
    'Nook',
    'Garage',
    'Pad',
    'Humidor',
    'Emporium',
    'Casino',
    'Joint',
    'Diner',
  ],
];

function getRandomElement(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function () {
  return (
    words
      .map(getRandomElement)
      .reduce((a, b) => `${a} ${b}`)
  );
}
