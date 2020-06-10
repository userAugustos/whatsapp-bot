import jimp from 'jimp';
import path from 'path';
import wa from '@open-wa/wa-automate';

function catchImage() {
	return `https://picsum.photos/400/400?random=${Math.random()}`;
}

async function getImageDimensions(image) {
	const largura = await image.getWidth();
	const altura = await image.getHeight();

	return {largura, altura}
}

async function getTextDimensions({font, text}) {
	const largura = await jimp.measureText(font, text);
	const altura = await jimp.measureTextHeight(font, text, largura);

	return {largura, altura}
}

function centerOfImage({imageDimension, textDimension}) {
	return imageDimension / 2 - textDimension / 2;
}

//auto chamada de função
//centerOfImage({imageDimension: imageDimensions.largura, textDimension: fontDimensions.largura})
(async () => {
	const link = catchImage();

	const image = await jimp.read(link);
	const imageDimensions = await getImageDimensions(image);

	const font28 = await jimp.loadFont(path.resolve('src/fonts/font28.fnt'));
	const fontDimensions = await getTextDimensions({font: font28, text: ""})

	//cirando a imagem
	let imageWithTextOne = await image.print(font28, 8, 300, 'Bom dia meu amigo!lembrese');
	let imageWithTextTwo = await imageWithTextOne.print(font28, 8, 330, 'limpe as lagrimas de ontem');
	const finalImage = await imageWithTextTwo.print(font28, 8, 358, 'por que hoje vc vai chorar mais');

	const imageToBase64 = await finalImage.getBase64Async(jimp.MIME_JPEG);
	
	const client = await wa.create();

	const allContacts = await client.getAllContacts();

	let contactsArray = ['BroJonas', 'Bar', 'Pai', 'Minori'];

	contactsArray.map(async contact =>  {
		const person = allContacts.filter(contato => contato.formattedName.indexOf(contact) !== -1);

		await client.sendFile(person, imageToBase64, 'teste.jpeg', "Testando meu robozinho amigo")
	})

})()
