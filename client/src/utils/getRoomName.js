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
		'Wolf\'s'
	],
	[
		'Pound', // places
		'Den',
		'House',
		'Hammock',
		'Yard',
		'Kennel',
		'Bowl'
	]
];

function getRandomElement(list) {
	return list[Math.floor(Math.random() * list.length)]
}

function getRoomName() {
	return (
		words
			.map(randomElement)
			.reduce((a, b) => `${a} ${b}`)
	);

};