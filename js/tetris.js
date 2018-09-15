/* js/tetris.js
*/
var oEvent = window.event,
	oWell = document.getElementById("well"),
	
	/* ### Przyciski wyboru środowisk testowych ### */
	oTest1 = document.getElementById("test1"),
	oTest2 = document.getElementById("test2"),
	oTest3 = document.getElementById("test3"),
	oTest4 = document.getElementById("test4"),
	oTest5 = document.getElementById("test5"),
	oTest6 = document.getElementById("test6"),
	oTest7 = document.getElementById("test7"),
	
	/* ### Kontrolki monitora gry ### */
	oLevelSelector = document.getElementById("level"),
	oGameplayLevel = document.getElementById("gameplayLevel"),
	oPoints = document.getElementById("points"),
	oLines = document.getElementById("lines"),
	oStartGameButton = document.getElementById("start-game"),
	oPauseGameButton = document.getElementById("pause-game"),
	
	//klocki	
	aGameImplementationTopLeft = [0,5], //2,7
	/*
		Ta zmienna to źródło do kopiowania współrzędnych [Y,X] do aActualTopLeft klocków.
		Kolejność i kierunek przepływu danych o współrzędnych to:
		aGameImplementationTopLeft -> oPiece{N}.aActualTopLeft 
		-> oActualPiece.aActualTopLeft -> poprzez funkcje {
		 - detectCollision(),
		 - stepDown(),
		 - stepSide(),
		 - flipPiece():
		 aTrialTopLeft
		} -> oActualPiece.aActualTopLeft
	*/
	oPieceO = {
		orientations: [
			[
				[0,0,0,0],
				[0,1,1,0],
				[0,1,1,0],
				[0,0,0,0]
			]
		],
		actualOrientation: 0,
		aActualTopLeft: aGameImplementationTopLeft.slice(), //aActualTopLeft zawiera BEZWGLĘDNE współrzędne [Y,X] względem lewego, górnego narożnika studzienki
		name: "Klocek O",
		color: "red"
	},
	oPieceI = {
		orientations: [
			[
				[0,0,0,0],
				[1,1,1,1],
				[0,0,0,0],
				[0,0,0,0]
			],
			[
				[0,0,1,0],
				[0,0,1,0],
				[0,0,1,0],
				[0,0,1,0]
			]
		],
		actualOrientation: 0,
		aActualTopLeft: aGameImplementationTopLeft.slice(),
		name: "Klocek I",
		color: "maroon"
	},
	oPieceS = {
		orientations: [
			[
				[0,0,0,0],
				[0,0,1,1],
				[0,1,1,0],
				[0,0,0,0]
			],
			[
				[0,0,1,0],
				[0,0,1,1],
				[0,0,0,1],
				[0,0,0,0]
			]
		],
		actualOrientation: 0,
		aActualTopLeft: aGameImplementationTopLeft.slice(),
		name: "Klocek S",
		color: "pink"
	},
	oPieceZ = {
		orientations: [
			[
				[0,0,0,0],
				[0,1,1,0],
				[0,0,1,1],
				[0,0,0,0]
			],
			[
				[0,0,0,1],
				[0,0,1,1],
				[0,0,1,0],
				[0,0,0,0]
			]
		],
		actualOrientation: 0,
		aActualTopLeft: aGameImplementationTopLeft.slice(),
		name: "Klocek Z",
		color: "blue"
	},
	oPieceL = {
		orientations: [
			[
				[0,0,0,0],
				[0,1,1,1],
				[0,1,0,0],
				[0,0,0,0]
			],
			[
				[0,0,1,0],
				[0,0,1,0],
				[0,0,1,1],
				[0,0,0,0]
			],
			[
				[0,0,0,1],
				[0,1,1,1],
				[0,0,0,0],
				[0,0,0,0]
			],
			[
				[0,1,1,0],
				[0,0,1,0],
				[0,0,1,0],
				[0,0,0,0]
			]
		],
		actualOrientation: 0,
		aActualTopLeft: aGameImplementationTopLeft.slice(),
		name: "Klocek L",
		color: "purple"
	},
	oPieceJ = {
		orientations: [
			[
				[0,0,0,0],
				[0,1,1,1],
				[0,0,0,1],
				[0,0,0,0]
			],
			[
				[0,0,1,1],
				[0,0,1,0],
				[0,0,1,0],
				[0,0,0,0]
			],
			[
				[0,1,0,0],
				[0,1,1,1],
				[0,0,0,0],
				[0,0,0,0]
			],
			[
				[0,0,1,0],
				[0,0,1,0],
				[0,1,1,0],
				[0,0,0,0]
			]
		],
		actualOrientation: 0,
		aActualTopLeft: aGameImplementationTopLeft.slice(),
		name: "Klocek J",
		color: "green"
	},
	oPieceT = {
		orientations: [
			[
				[0,0,0,0],
				[0,1,1,1],
				[0,0,1,0],
				[0,0,0,0]
			],
			[
				[0,0,1,0],
				[0,0,1,1],
				[0,0,1,0],
				[0,0,0,0]
			],
			[
				[0,0,1,0],
				[0,1,1,1],
				[0,0,0,0],
				[0,0,0,0]
			],
			[
				[0,0,1,0],
				[0,1,1,0],
				[0,0,1,0],
				[0,0,0,0]
			]
		],
		actualOrientation: 0,
		aActualTopLeft: aGameImplementationTopLeft.slice(), //[Y,X] !!
		name: "Klocek T",
		color: "orange"
	},
	
	//tablica klocków
	aPieces = [
		oPieceO,
		oPieceI,
		oPieceS,
		oPieceZ,
		oPieceL,
		oPieceJ,
		oPieceT
	],

	oActualPiece = {}, //do tego obiektu zostanie skopiowany obiekt aktualnie wylosowanego/utworzonego klocka. Obiekt będzie przetrzymywać informacje o położeniu oraz orientacji właśnie spadającego klocka aż do momentu jego wylądowania. Wtedy nastąpi nadpisanie zmiennej danymi nowoutworzonego klocka.
	aTrialTopLeft = null,
	/* aTrialTopLeft (docelowo tablica) wskazuje PROPONOWANE nowe bezwględne współrzędne lewego, górnego [X,Y] segmentu aktualnie spadającego klocka. Zmienna ustawiana przez funkcje:
		- spawnPiece(),
		- stepDown(),
		- stepSide().
	*/
	aRowCompleteness = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	/* Tablica jednowymiarowa, 21-elementowa przechowująca w swoich elementach informację o ilości zapełnionych segmentów w danym rzędzie studzienki. Jeden element tablicy = jeden rząd. Index [0] to zerowy (techniczny, nieaktywny!) rząd studzienki, [21] to rząd dwudziesty.
	Tablicę aktualizują:
		- funkcja land() podczas etapu osadzania klocka,
		- funkcja render() podczas etapu.
	*/
	iNextPiece = 0, //kolejny klocek w kolejce po aktualnie granym
	
	iRowCounter = 0, //licznik skompletowanych i wyczyszczonych rzędów
	
	iInitialLevel = 6, //numer poziomu startowego
	
	iActualLevel = 1, //numer osiągniętego poziomu rozgrywki
	
	iActualSpeed = 500, //czas w ms opóźnienia skoku grawitacji. Wartość deklarowana. Wartość tej zmiennej będzie ustawiana przez funkcję setSpeed().
		
	bClearRows = false,
	/*
		Flaga głównej pętli programu informująca, czy w danym momencie rozgrywki występuje sytuacja, w której osadzony klocek zapełnił jedną lub więcej rzędów studzienki.
		JEŚLI ustawiona na TRUE, uruchamia się funkcja collapse().
		Flagę modyfikuje funkcja land().
	*/
	bGameOver = true,
	/*
		Flaga głównej pętli programu informująca, czy rozgrywka dobiegła końca.
		JEŚLI ustawiona na TRUE, przerywana jest pętla poprzez wywołanie clearInterval(iGravityInterval) "grawitacji".
		Flaga modyfikowana jest wewnątrz funkcji stepDown(), po sprawdzeniu wyniku powrotu z funkcji drawPiece().
	*/
	bRestarted = false,
	/*
		Flaga informująca, czy zaczyna się kolejna rozgrywka po porzedniej, zakonczonej. Zmienna stanowi obejście dla problemu natychmiastowego opadania klocka po wywołaniu ponownej gry.
	*/
	bPlay = false,
	/*
		Flaga stanu rozgrywki: trwająca gra (TRUE); pauza (FALSE)
	*/
	aEndGamePromts = [
		"Brawo! Mocne 2/10, hahaha!",
		"Nie no! Tak złej gry to dawno nie widziałem!",
		"Twój debiut? Nie?! No cóż...",
		"Tak, tak - nie każdy może być mistrzem. Tobie to nie grozi",
		"Spoko - następna gra pójdzie ci jeszcze gorzej, ale się nie zrażaj, hahaha!"
	],
	
	iTrialOrientation = null,
	/* iTrialOrientation (docelowo liczba całkowita) wskazuje PROPONOWANĄ nową orientację aktualnie spadającego klocka. Zmienna ustawiana poprzez funkcję flipPiece().
	*/
	bLandCondition = false,
	/*
		Flaga głównej pętli programu informująca, czy w danym momencie występuje sytuacja, że spadający klocek CHOĆ JEDNYM swoim wypełnionym segmentem dolega od dołu do którejś z ZAJĘTYCH komórek studzienki (o współrzędnej Y+1 względem tego segmentu).
	*/
	oTestEnvironment = {
		scenarios: [
			[
				"Space Invaders",
				"#00f",
				[0,0,1,0,0,0,0,1,0,0],
				[1,0,0,1,0,0,1,0,0,1],
				[1,0,1,1,0,0,1,1,0,1],
				[1,1,1,0,1,1,0,1,1,1],
				[1,1,1,1,1,1,1,1,1,1],
				[0,1,1,1,1,1,1,1,1,0],
				[0,0,1,1,1,1,1,1,0,0],
				[0,0,1,0,0,0,0,1,0,0],
				[0,0,1,0,0,0,0,1,0,0],
				[0,1,0,0,0,0,0,0,1,0]
			],
			[
				"Pac-Man",
				"#ffc623",
				[0,0,0,0,0,1,1,1,1,1],
				[0,0,0,1,1,1,1,1,1,1],
				[0,0,1,1,1,1,1,1,1,0],
				[0,0,1,1,1,1,1,1,0,0],
				[0,1,1,1,1,1,1,0,0,0],
				[0,1,1,1,1,1,0,0,0,0],
				[0,1,1,1,1,0,0,0,0,0],
				[0,1,1,1,1,1,0,0,0,0],
				[0,1,1,1,1,1,1,0,0,0],
				[0,0,1,1,1,1,1,1,0,0],
				[0,0,1,1,1,1,1,1,1,0],
				[0,0,0,1,1,1,1,1,1,1],
				[0,0,0,0,0,1,1,1,1,1]
			],
			[
				"E.T. the Extra-Terrestrial",
				"#81c33e",
				[1,1,1,1,1,1,1,1,1,0],
				[1,0,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1],
				[1,1,0,0,0,0,0,0,1,1],
				[0,0,0,0,0,0,0,0,1,1],
				[0,0,0,0,0,1,1,1,1,1],
				[0,0,0,0,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1],
				[1,0,1,1,1,1,1,1,1,1],
				[0,0,1,1,1,1,1,1,1,1],
				[0,0,1,0,0,1,0,0,1,1],
				[0,1,1,0,0,0,0,0,1,1],
				[1,1,1,0,0,0,1,1,1,1],
			],
			[
				"Super Mario GB",
				"#de0000",
				[0,0,0,1,1,1,0,0,0,0],
				[0,0,1,1,1,1,1,1,1,1],
				[0,1,1,1,0,0,1,0,0,0],
				[1,1,0,1,1,0,0,0,0,0],
				[1,1,0,0,0,0,0,1,1,0],
				[0,0,0,1,1,1,0,0,0,0],
				[0,1,1,1,1,1,1,0,0,0],
				[0,1,1,1,1,1,1,1,1,0],
				[0,1,0,0,0,0,0,1,0,1],
				[1,1,0,1,1,1,1,0,1,1],
				[0,0,1,1,0,0,1,1,0,0],
				[0,1,1,1,0,0,1,1,1,0]
			],
			[
				"Pong",
				"#222",
				[1,0,1,0,1,0,1,0,1,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,1,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,0],
				[0,1,0,1,0,1,0,1,0,1]
			],
			[
				"Secret box",
				"#540c0c",
				[0,1,1,1,1,1,1,1,0],
				[1,0,0,1,1,1,0,0,1],
				[1,0,1,0,0,0,1,0,1],
				[1,0,1,0,0,1,1,0,1],
				[1,0,0,0,1,1,0,0,1],
				[1,0,0,0,1,0,0,0,1],
				[1,0,0,0,0,0,0,0,1],
				[1,0,0,0,1,0,0,0,1],
				[0,1,1,1,1,1,1,1,0]
			],
			[
				"Quake",
				"#bd4f00",
				[0,0,1,0,0,0,1,0,0],
				[0,1,0,0,0,0,0,1,0],
				[1,0,0,0,0,0,0,0,1],
				[1,0,0,1,1,1,0,0,1],
				[1,1,0,0,1,0,0,1,1],
				[0,1,1,1,1,1,1,1,0],
				[0,0,0,1,1,1,0,0,0],
				[0,0,0,0,1,0,0,0,0],
				[0,0,0,0,1,0,0,0,0],
				[0,0,0,0,1,0,0,0,0]
			]
		]
	},
	

	oRows = oWell.getElementsByClassName("row"),
	//rzędy studzienki jako potomkowie elementu #well o klasie "row"
	
	oNextPiece = document.getElementById("next-piece"),
	oPreviev = oNextPiece.getElementsByClassName("row");
	
	//spajanie rzędów i komórek w jeden obiekt, którego elementy można łatwo adresować i po nich iterować
oRows.row = [];
j=0;
do {
	oRows.row.push(oRows[j].getElementsByClassName("cell"));
}
while(oRows[++j]);

	
var sCellBorderColor = oRows.row[0][0].style.borderColor,
	aEntropyPool = [], //pula entropii

	//### Funkcje ###
	setSpeed = function() {
		iActualLevel = iInitialLevel;
		iActualSpeed = ((12 - iActualLevel)*50);
		return iActualSpeed;
	}
	generateEntropyPool = function(rows, chars) {
		/*Generuje tzw. pulę entropii, czyli tablicę
		rows-elementową o chars ilości znaków w każdym elemencie.
		Pulę enrtopii generuje się tuż przed rozpoczęciem rozgrywki w funkcji initGame().
		W trakcie gry, z puli entropii losowany jest kolejny wiersz i znak (cyfra [0-6]), który dokładany jest do dwuelementowej kolejki (FIFO). Kolejka reprezentuje aktualnie opadający klocek oraz klocek następny w kolejności. Na początku gry pobierane są dwie losowe wartości z puli entropii.
		
		chars to mnożnik wynikowego ciągu o dł. 10*chars
		*/
		var gt6 = function(match, p1, offset, string) {
			p1 = parseInt(p1);
			p1 = p1*(Math.ceil(Math.random()));
			return p1%7;
		},
		i = 0,
		sRow = "",
		sTemp = "",
		iRand = 0,
		aRandEntropyPool = [];
		if(parseInt(chars)<=0 || parseInt(rows)<=0) {
			return false;
		}
		//pętla elementów tablicy
		do {
			sRow = "";
			i = chars;
			//pętla wierszy znaków
			do {
				iRand = (Math.random())*10000000000;
				iRand = Math.floor(iRand);
				sTemp = iRand + "";
				sRow += sTemp.replace(/[7-9]/g, gt6);
	 		}
			while(--i);
			aRandEntropyPool.push(sRow);
		}
		while(--rows);
		return aRandEntropyPool;
	},
	pickChar = function() {
		var r = Math.ceil(Math.random()*10), //wiersz w puli entropii
			c = Math.ceil(Math.random()*100); //znak w wierszu
		if(r > 9 || r < 0) {
			r = 0;
		}
		if(c > 99 || c < 0) {
			c = 0;
		}
		row = new String(aEntropyPool[r]);
		iChar = parseInt(row.charAt(c))
		if(iChar<0) {
			iChar = 0;
		}
		return iChar;
	},	
	initGame = function() {
		/*
			Resetuje ustawienia gry na początku rozgrywki.
		*/
		aEntropyPool = generateEntropyPool(10,10); //generowanie puli entropii

		/* Losowanie pierwszego klocka*/
		iNextPiece = pickChar();
		
		aRowCompleteness = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //reset zmiennej globalnej
		var ileOdGory = 1,
			ileOdPrawej = 2,

		//czyszczenie studzienki z artefaktów
		rw = 20;
		do {
			//rzędy
			cl = 11;
			do {
				//kolumny
				oRows.row[rw][cl].style.backgroundColor = "#fff";
				oRows.row[rw][cl].setAttribute("occupied",0);
				oRows.row[rw][cl].style.border = "1px solid "+sCellBorderColor;
			}
			while(--cl >= 2);
		}
		while(--rw >= ileOdGory);
		
		bGameOver = false; //reset flagi końca gry
		iInitialLevel = oLevelSelector.value; //ustawienie poziomu gracza (jeśli dostępne)
		bPlay = true; //ustawienie flagi rozgrywki na trwającą
		
		return;
	},
	drawPiece = function() {
		/* Losuje nowy klocek, który pojawi się na górze studzienki */
		oActualPiece = aPieces[iNextPiece];
		console.log("Aktualny klocek: "+iNextPiece);
		
		/* Losowanie kolejnego klocka*/
		iNextPiece = pickChar();
		
		if(spawnPiece()) {
			return true; //aby utworzyć kaskadę ewentualnych błędów
		}
		return false;
	},
	spawnPiece = function() {
		/* Ustawia klocek w jego początkowej pozycji w studzience
		 i początkowej orientacji
		 
		 ### Zwracane wartości ###
			FALSE w przypadku możliwości stworzenia nowego klocka; TRUE w przeciwnym przypadku, co oznacza koniec gry.
		*/
		
		aTrialTopLeft = aGameImplementationTopLeft.slice(); //[0,5]; //ustawienie miejsca startowego 
		iTrialOrientation = 0;
		if(detectCollision()) {
			return true;
		}
		render();
		return false;
	},
	stepDown = function() {
		/*
		Zasadniczo jest to:
		 - główna pętla gry, gdyż wyzwala się ona poprzez setInterval(),
		 - funkcja odpowiedzialna za grawitację rozgrywki Tetrisa.
		*/
		
		/* Sprawdź poziom i zaktualizouj prędkość opadania klocka */
		//iActualLevel = oLevelSelector.value; //UWAGA! Brak zabezpieczenia przed debilami, którzy wpiszą np. 1000 lub -5!
		iActualLevel = 1 + Math.floor((iRowCounter-1)/10);
		oGameplayLevel.firstChild.nodeValue = iActualLevel;
		setSpeed();
		console.log(iActualSpeed);
				
		//UWAGA! KARKOLOMNE ROZWIĄZANIE O CHARAKTERZE REKURENCJI
		clearInterval(iGravityInterval);
		iGravityInterval = setInterval(stepDown, iActualSpeed);
		
		aTrialTopLeft = oActualPiece.aActualTopLeft.slice(); //konieczenie kopiujemy tablicę metodą, bo inaczej stworzymy tylko wskaźnik na kopiowany obiekt!
		if(bRestarted) {
			aTrialTopLeft = [0,5]; //UWAGA przy jakichkolwiek zmianach!
			bRestarted = false;
		}
		else {
			aTrialTopLeft[0]++;
		}

		if(aTrialTopLeft[0]>19) {
			//down&dirty hack!
			aTrialTopLeft[0] = 19;
			//console.log("Uwaga! Koniec studzienki!");
		}
		if(bLandCondition) {
			land();
			if(bClearRows) {
				collapse();
			}
			if(drawPiece()) {
				bGameOver = true;
			}
		}
		if(bGameOver) {
			clearInterval(iGravityInterval);
			console.log("Game over!");
			s = Math.ceil((Math.random()*1000))%5;
			prompt = aEndGamePromts[s];
			alert(prompt);
			/*TODO: zachowaj stan gry:
			 - zaawnsowanie poziomu osiągnięte przez gracza w grze
			 - pozwól wpisać graczowi swoje inicjały w tabeli Hi-Score
			 */
			 bRestarted = true;
			 return;
		}
		if(detectCollision()) {
			return;
		}
		render();
		return;
	},
	stepSide = function(bDirection) {
		/* Jedna funkcja, która w zależności od przekazanego argumentu, przesuwa klocek w lewo (0) lub w prawo (1)
		*/
		var i = -1; //ruch w lewo
		
		if(bDirection) {
			i = 1; //ruch w prawo
			//console.log("W prawo!");
		}
		else {
			//console.log("W lewo!");
		}
		
		aTrialTopLeft = oActualPiece.aActualTopLeft.slice();
		aTrialTopLeft[1] = aTrialTopLeft[1]+i;
		if(aTrialTopLeft[1]<0 || aTrialTopLeft[1]>10) {
			//down&dirty hack again!
			aTrialTopLeft = null;
			console.log("Niedozwolony ruch!");
			return;
		}
		if(detectCollision()) {
			return;
		}
		//console.log("Rendering");
		render();
		return;
	},
	flipPiece = function() {
		/* Obraca klocek o 90 stopni przeciwnie
			do kierunku wskazówek zegara
		*/
		aTrialTopLeft = oActualPiece.aActualTopLeft.slice(); //koniecznie musi zostać skopiowana tablica zawierająca współrzędne klocka!

		iTrialOrientation = oActualPiece.actualOrientation;
		if(++iTrialOrientation > (oActualPiece.orientations.length-1)) {
			iTrialOrientation = 0;
		}
		if(detectCollision()) {
			return;
		}
		//console.log("Rendering");
		render();
		return;
	},
	dropPiece = function() {
		/*
			Funkcja odpowiada za natychmiastowy zrzut klocka do miejsca jego lądowania w najniższym możliwym punkcie w danych warunkach rozgrywki.

		### Algorytm ###
		1. Skopiuj obraz matrycy klocka oActualPiece[actualOrientation] do aActualMatrix
		2. POMYSŁ na dalszy krok:
		 - odfiltruj z aActualMatrix tylko wypełnione segmenty tworząc tym samym nową wersję aActualMatrix zawierającą informację tylko o wypełnionych segmentach. Tutaj dokonaj transkrybcji współrzędnych na rzeczywiste.
		 3. Zaczynając od dolnego rzędu (o najwyższym numerze) aActualMatrix, iteruj po jego segmentach:
		  - dla X-owej współrzędnej rzeczywistej bieżącego segmentu przeszukaj rzędy od X+1 do X+n w poszukiwaniu stanu occupied ="1"
		  TU SKOŃCZYŁEŚ: zajrzyj jeszcze do kodu funkcji land(), bo tam mogą znajdować się ciekawe pomysły
		  
		*/
		
		//1.
		aActualMatrix = oActualPiece.orientations[oActualPiece.actualOrientation].slice();
		
		//2.
		var r = 0, c;
		do {
			c = 0; //pierwszy od lewej segment klocka
			do {
				cellState = aActualMatrix[r][c];
				if(cellState==1) {
					//tutaj już należy dokonać transkrybcji wypełnionych segmentów na ich współrzędne rzeczywiste w studzience
				}
				else {
					//usuń element aActualMatrix[r][c] (dla danej iteracji)
				}
			}
			while(++c<4);
		}
		while(++r<4);
		//po zakończeniu tej pętli powinna zostać matryca zawierająca tylko wypełnionych segmenty
		console.log(aActualMatrix);
		return false;
	},
	keyboardHandler = function(oEvent) {
		//obługa klawiatury dla ruchu klocków. Być może trzeba zmienić nazwę tej funkcji
		switch(oEvent.keyCode) {
			case 32:	bGameOver ? main() : togglePlay();
			break;
			//Przesuwanie klocka w lewo
			case 37:	bPlay ? stepSide(0) : null;
			break;
			//Obrót klocka (zawsze przeciwnie do ruchu wskazówek zegara)
			case 38:	bPlay ? flipPiece() : null;
			break;
			//Przesuwanie klocka w prawo
			case 39: bPlay ? stepSide(1) : null;
			break;
			//Przesuwanie klocka w dół
			case 40:	bPlay ? dropPiece() : null;
			break;
		}
		/* TYLKO DLA DEBUGGERA!
			Funkcja pozwala wybrać rodzaj pojawiającego się klocka.
			Tylko dla klawiatury
		*/
		piece = oPieceO; //zabezpieczenie na wypadek braku przekazanego argumentu  lub przekazania błędnego
		switch(oEvent.key) {
			case "o": oActualPiece = oPieceO;
			console.log("Wymuszono klocek O");
			spawnPiece();
			break;
			
			case "i": oActualPiece = oPieceI;
			console.log("Wymuszono klocek I");
			spawnPiece();
			break;
			
			case "s": oActualPiece = oPieceS;
			console.log("Wymuszono klocek S");
			spawnPiece();
			break;
			
			case "z": oActualPiece = oPieceZ;
			console.log("Wymuszono klocek Z");
			spawnPiece();
			break;
			
			case "l": oActualPiece = oPieceL;
			console.log("Wymuszono klocek L");
			spawnPiece();
			break;
			
			case "j": oActualPiece = oPieceJ;
			console.log("Wymuszono klocek J");
			spawnPiece();
			break;
			
			case "t": oActualPiece = oPieceT;
			console.log("Wymuszono klocek T");
			spawnPiece();
			break;
		}
		return;
	},

	detectCollision = function() {
		/*
		Funkcja sprawdza, czy:
		1) Jakikolwiek wypełniony segment danego klocka koliduje z istniejącym segmentem zalegających już w studzience klocków lub brzegami studzienki
		2) W PRZYPADKU BRAKU KOLIZJI, czy występuje warunek osadzania (lądowania) klocka

		 ### Zwracane wartości ###
			1) FALSE w przypadku BRAKU kolizji; TRUE w przeciwnym wypadku.
			2) funkcja niejawnie ustawia globalną zmienną bLandCondition na TRUE w przypadku zaistniennia warunku lądowania klocka i resetuje ją na FALSE w przeciwnym razie.

		 ### Algorytm ###
		 1. Przeczytaj zmienną aTrialTopLeft, którą zaktualizowały funkcje:
		  - spawnPiece(),
		  - stepDown(),
		  - stepSide().
		  Te funkcje zapisują współrzędne BEZWZGLĘDNE nowej, testowanej pozycji klocka do zmiennej aTrialTopLeft. Wartość zmiennej aTrialTopLeft wylicza się poprzez zwiększenie lub zmniejszenie o 1 wybranych wartości [Y, X] w tablicy na podstawie tablicy oActualPiece.aActualTopLeft.
		  UWAGA! oActualPiece.aActualTopLeft zawiera BEZWGLĘDNE współrzędne względem lewego, górnego narożnika studzienki, więc aTrialTopLeft też takowe zawiera!

		  JEŻELI aTrialTopLeft == null -> przepisz wartość oActualPiece.aActualTopLeft do aTrialTopLeft;*/
		if(aTrialTopLeft == null) {
			aTrialTopLeft = oActualPiece.aActualTopLeft.slice();
		}
		 /*
		 2. Przeczytaj zmienną iTrialOrientation.
			 Tą zmienną aktualizuje funkcja flipPiece().
			 JEŻELI iTrialOrientation == null -> przepisz wartość oActualPiece.actualOrientation do iTrialOrientation;*/
		if(iTrialOrientation == null) {
			iTrialOrientation = oActualPiece.actualOrientation;
		}
		/*
		 3. Iterując:
			 od współrzędnej bezwzględnej aTrialTopLeft[X+3,Y+3]
			 do aTrialTopLeft[X,Y]
	sprawdź, czy wynik operacji:
		JEŻELI
	oRows.row[aTrialTopLeft[X]][aTrialTopLeft[Y]].getAttribute("occupied")==1	{zajęta komórka studzienki}
		AND 
	oActualPiece.orientations[iTrialOrientation][Y][X]==1 {zajęty segment klocka}
		TO
	Przerwij pętlę, bo choćby pojedyncza kolizja wyklucza możliwość aktualnego ruchu.
		*/

		var iSucces = 16,  //zmienna informujaca o braku kolizji, jeśli osiągnie wartość 0
		r = 3, //czwarty (najniższy) rząd klocka
		c;
		
		//pętla detekcji kolizji
		do {
			c = 3; //czwarty od lewej segment klocka
			offsetY = aTrialTopLeft[0]+r; //współrzędna bezwględna Y
			do {
				offsetX = aTrialTopLeft[1]+c; //współrzędna bezwględna X
				oCell = oRows.row[offsetY][offsetX];
				occupied = oCell.getAttribute("occupied")*1;
				if(occupied==1 && oActualPiece.orientations[iTrialOrientation][r][c]==1) {
					//console.log("Kolizja przy Y:"+offsetY+"; X:"+offsetX+" Wynik: "+occupied);
					break;
				}
				iSucces--;
			}
			while(c--);
			r--;
		}
		while(r>=0);
		/*
		4. JEŻELI licznik iSucces pętli w (3) osiągnął oczekiwaną wartość (zero), to 
		  - przepisz wartość aTrialTopLeft do oActualPiece.aActualTopLeft i aTrialTopLeft ustaw na null
		  - przepisz wartość iTrialOrientation do oActualPiece.actualOrientation i iTrialOrientation ustaw na null
		  JEŻELI NIE:
		   ustaw zmienną bLandCondition na false.
		*/
		if(iSucces==0) {
			oActualPiece.aActualTopLeft = aTrialTopLeft.slice();
			aTrialTopLeft = null;
			oActualPiece.actualOrientation = iTrialOrientation;
			iTrialOrientation = null;
			//console.log("Ruch dozwolony.");
			
			// ### TUTAJ DETEKCJA stanu lądowania
			bLandCondition = false; //reset stanu land condition
			r = 4; //czwarty rząd poniżej klocka
			do {
				c = 3; //czwarty od lewej segment oActualPiece.aActualTopLeft[0] klocka
				offsetY = oActualPiece.aActualTopLeft[0]+r; //współrzędna bezwględna Y
				do {
					offsetX = oActualPiece.aActualTopLeft[1]+c; //współrzędna bezwględna X
					oCell = oRows.row[offsetY][offsetX];
					occupied = oCell.getAttribute("occupied")*1;
					cellState = oActualPiece.orientations[oActualPiece.actualOrientation][r-1][c]*1;
					if(occupied==1 && cellState==1) {
						//console.log("Land condition przy Y:"+offsetY+"; X:"+offsetX);
						bLandCondition = true;
						break;
					}
				}
				while(c--);
				r--;
			}
			while(r>0);

			return false; //czyli brak kolizji
		}
		else {
			iTrialOrientation = null;
			//console.log("Niedozwolony ruch!");
		}
		return true; //true oznacza kolizję
	},
	
	render = function() {
		/* Funkcja rysuje rzędy studzienki począwszy od współrzędnej Y-1 aktualnego aż po 4. rząd zajmowany przez klocek.
		 Funkcja odświeża więc wygląd planszy w obrębie 5 rzędów w otoczeniu klocka.
		*/
		var c = 0,
			r = 0,
			offsetX = 0, 
			offsetY = 0,
			aActualMatrix;
			/* offsetX i offsetY to komórka rysowania danego segmetu klocka w studzience */
		
		if(oActualPiece.aActualTopLeft[0]>0) {
			//ustawianie współrzędnej Y rzędu renderowania na jeden powyżej poziomu najwyższego rzędu klocka
			offsetY = oActualPiece.aActualTopLeft[0]-1;
		}
		if(oActualPiece.aActualTopLeft[1]>0) {
			//ustawianie współrzędnej X kolumny renderowania na jedną przed skrajnym lewym klocka
			offsetX = oActualPiece.aActualTopLeft[1]-1;
		}
		/*
			### Pętla czyszczenia komórek studzienki po poprzednim położeniu klocka ###
		*/
		do {
			//pętla rzędów: iterujemy przez 5 rzędów
			//offsetY = r + oActualPiece.aActualTopLeft[0]; //TODO: to jest do wywalenia?
			c = 0;
			do {
				//pętla kolumn (komórek): iterujemy przez 6 kolumn
				cellX = offsetX+c;
				cellState = oRows.row[offsetY][cellX].getAttribute("occupied")*1; // czy zajęta + hack na rzutowanie zmiennej!
				if(cellState!=1) {
					//wyczyść tło, jeśli komórka nie jest zajęta 
					oRows.row[offsetY][cellX].style.backgroundColor = "#fff";
				}
				//w każdym przypadku przywróć początkowe obramowanie komórek studzienki
				oRows.row[offsetY][cellX].style.border = "1px solid "+sCellBorderColor;
			}
			while(++c<=5);
			offsetY++;
		}
		while(++r<=4);
		
		// ### Pętla rysowania segmentów klocka w jego nowym położeniu ###
		aActualMatrix = oActualPiece.orientations[oActualPiece.actualOrientation];
		//TODO: sprawdzić, jak przepisanie tablicy dwuwymiarowej do nowej zmiennej wpływa na sprawność działania skryptu
		r = 0;
		offsetX = oActualPiece.aActualTopLeft[1];
		do {
			//pętla rzędów: iterujemy tylko przez 4 rzędy
			offsetY = r + oActualPiece.aActualTopLeft[0];
			c = 0;
			do {
				//pętla kolumn (komórek): iterujemy tylko przez 4 kolumny
				cell = aActualMatrix[r][c]*1; // hack na rzutowanie zmiennej!
				
				if(cell==1) {
					//rysuj segment klocka
					oRows.row[offsetY][offsetX+c].style.backgroundColor = oActualPiece.color;
				}
				else {
					//rysuj siatkę pustych segmentów w trybie debuggera
					//oRows.row[offsetY][offsetX+c].style.border = "1px dashed #bbb";
				}
			}
			while(++c<=3);
		}
		while(++r<=3);
		return;
	},
	drawNextPiece = function() {
		/* 
			Funkcja rysuje podgląd kolejnego klocka w okienku interfejsu gracza.
		*/
		var c = 0,
			r = 0,
			offsetX = 0, 
			offsetY = 0,
			aNextMatrix;
			/* offsetX i offsetY to komórka rysowania danego segmetu klocka w studzience */
		
		// ### Pętla rysowania segmentów klocka w jego nowym położeniu ###
		aNextMatrix = aPieces[iNextPiece].orientations[0].slice();
		r = 0;
		//offsetX = oActualPiece.aActualTopLeft[1];
		do {
			//pętla rzędów: iterujemy tylko przez 4 rzędy
			offsetY = r + oActualPiece.aActualTopLeft[0];
			c = 0;
			do {
				//pętla kolumn (komórek): iterujemy tylko przez 4 kolumny
				cell = aActualMatrix[r][c]*1; // hack na rzutowanie zmiennej!
				
				if(cell==1) {
					//rysuj segment klocka
					oRows.row[offsetY][offsetX+c].style.backgroundColor = oActualPiece.color;
				}
				else {
					//rysuj siatkę pustych segmentów w trybie debuggera
					//oRows.row[offsetY][offsetX+c].style.border = "1px dashed #bbb";
				}
			}
			while(++c<=3);
		}
		while(++r<=3);
		return;
	},
	collapse = function() {
		/* Funkcja czyści kompletne rzędy studzienki oraz przenosi wszystkie wypełnione (osadzone) komórki studzienki o tyle rzędów niżej, ile to możliwe.
		UWAGA! Ta funkcja jest rodzajem RENDERERA.
		*/
		
		//znajdź i wyczyść kompletne rzędy
		var r = oActualPiece.aActualTopLeft[0], //licznik rzędów; zaczynamy od najwyższego rzędu klocka
			i = 4; //ogranicznik maks. ilości czyszczonych rzędów do 4 (kolejny, sprytny hack)
			
		//pętla usuwania kompletnych rzędów studzienki
		do {
			if(aRowCompleteness[r]==10) { //aRowCompleteness przechowuje informację o ilości wypełnionych segmentów w każdym z 20 rzędów studzienki
			
			/* ### Operacje usuwania ### */
				oWell.removeChild(oRows[r]); //usuwanie kompletnego rzędu studzienki (WIDOK)
				oRows.row.splice(r, 1); //usuwanie kompletnego rzędu z teblicy rzędów (LOGIKA)
				aRowCompleteness.splice(r, 1); //usuwanie indeksu kompletnego rzędu z tablicy aRowCompleteness
			
			/* ### Operacje wstawiania ### */
				var oNewRow = oRows[1].cloneNode(true); //klonowanie pierwszego rzędu studzienki wraz z jego komórkami
				
				oWell.insertBefore(oNewRow, oRows[1]); //wstawianie rzędu do WIDOKU
				oRows.row.splice(1, 0, oNewRow.getElementsByClassName("cell")); //wstawianie rzędu do LOGIKI
				aRowCompleteness.splice(1, 0, 0); //wstawianie nowego indeksu [1](! - tak, dla zachowania spójności i logiki) o wartości zero do tablicy aRowCompleteness
			
			/* ### Powiększ licznik kompletnych rzędów ### */
				iRowCounter++;
			}
			if(++r>20) {
				//Nie ma sensu kontynuować pętli powyżej rzędu 20.
				break;
			}
			 
		}
		while(--i>0); // || ++r<21
		//console.log(Object.entries(oRows));

		/*var oDraft = Object.assign({},oRows), //kopiujemy obiekt oRows
			aBeginLine = oRows.slice(2, 2); //czyli linia startowa pierwszego widocznego segmentu klocka po jego wskrzeszeniu na polu gry
		oDraft.splice(1, 1, aBeginLine); //zastąp indeks [1] poprawną wersją linii startowej
		oDraft.splice(2, 1, oNewRow); //zastąp indeks [2] czystą wersją dodanej linii
		//powyższe dwie linie tylko zamieniają rzędy miejscami w tablicy.
		oRows = oDraft.slice(); //kopiowanie z powrotem zawartości tablicy do porodukcyjnej tablicy oRows
		*/
		//pętla renumeracji atrybutu id każdego z aktywnych rzędów studzienki
		var sIdString = "";
		r = 23; //korekta r z 21 na 23
		do {
			sIdString = "row-";
			sIdString += r;
			//console.log("Rząd "+r+" id="+oRows[r].getAttribute("id"));
			oRows[r].setAttribute("id", sIdString);
		}
		while(--r>0);
		//uaktualnienie tablicy wyników
		oLines.firstChild.nodeValue = iRowCounter;
		bClearRows = false;
		return;
	},
	land = function() {
		var r = 3, //czwarty rząd poniżej klocka
			c;
		do {
			c = 3; //czwarty od lewej segment oActualPiece.aActualTopLeft[0] klocka
			offsetY = oActualPiece.aActualTopLeft[0]+r; //współrzędna bezwględna Y
			do {
				offsetX = oActualPiece.aActualTopLeft[1]+c; //współrzędna bezwględna X
				oRow = oRows.row[offsetY][offsetX];
				cellState = oActualPiece.orientations[oActualPiece.actualOrientation][r][c]*1;
				if(cellState==1) {
					oRow.setAttribute("occupied",1);
					//console.log("Segment w Y:"+offsetY+"; X:"+offsetX+" został dobudowany!");
					if(++aRowCompleteness[offsetY]==10) {
						//aktualizacja ilości segmentów w danym rzędzie studzienki z jednoczesnym sprawdzeniem kompletności wypełnienia rzędu
						bClearRows = true;
						//console.log("Rząd "+offsetY+" jest gotowy do skasowania!");
					}
					else {
						//console.log("Rząd "+offsetY+" ma teraz "+aRowCompleteness[offsetY]+" element(ów)");
					}
				}
			}
			while(c--);
			r--;
		}
		while(r>=0);
		bLandCondition = false; //zerowanie land condition
		//console.log("Orzeł wylądował!");
		return;
	},
	
	iGravityInterval = null,
	
	togglePlay = function() {
		if(bPlay) {
			//jeśli rozgrywka trwa, pauzuj ją!
			clearInterval(iGravityInterval);
			console.log("Pauza!");
			bPlay = false;
		}
		else {
			//jeśli spauzowano rozgrywkę, wznów ją!
			stepDown();
			console.log("Grę wznowiono!");
			bPlay = true;
		}
		return;
	},
	
	main = function() {
		initGame(); //reset środowiska rozgrywki
		stepDown(); //rozpoczęcie głównej pętli rozgrywki
		return;
	},
	
	restart = function() {
		//TODO: prawdopodobnie do integrowania w f-cji main()
		drawPiece(); //losuj klocek inicjujący grę po restarcie
		bRestarted = true;
		main();
		return;
	},
	
	loadTest = function(i) {
		//procedurwa testowa rysownia pikselartu w studzience
		//UWAGA! Procedura NIE jest idiotoodporna - dbaj o właściwe współrzędne!
		var l = oTestEnvironment.scenarios[i].length;
		l--; //wskazuje na ostatni indeks tablicy rzędów obrazka
		var c = oTestEnvironment.scenarios[i][l].length; //ile kolumn w danym rzędzie; wszystkie rzędy mają równą ilość kolumn 
		c--; //wskazuje na ostatni indeks tablicy kolumn obrazka
		var ileOdGory = 6,
			ileOdPrawej = 2,

		//czyszczenie studzienki z artefaktów
		rw = 20;
		
		aRowCompleteness = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //reset zmiennej globalnej
		do {
			//rzędy
			cl = 11;
			do {
				//kolumny
				oRows.row[rw][cl].style.backgroundColor = "#fff";
				oRows.row[rw][cl].setAttribute("occupied",0);
				oRows.row[rw][cl].style.border = "1px solid "+sCellBorderColor;
			}
			while(--cl >= 2);
		}
		while(--rw >= ileOdGory);
		
		console.log("Ładuję środowisko testowe '"+oTestEnvironment.scenarios[i][0]+"'");
		do {
			offsetY = ileOdGory+l;
			c = oTestEnvironment.scenarios[i][l].length;
			c--;
			row = oTestEnvironment.scenarios[i][l]; //dany rząd obrazka
			do {
				offsetX = ileOdPrawej+c; //kolumny
				if(row[c]==1) {
					oRows.row[offsetY][offsetX].style.backgroundColor = oTestEnvironment.scenarios[i][1];
					oRows.row[offsetY][offsetX].setAttribute("occupied",1);
					aRowCompleteness[offsetY]++;
				}
				else {
					oRows.row[offsetY][offsetX].style.backgroundColor = "#fff";
					//oRows.row[offsetY][offsetX].style.border = "1px solid green";
				}
			}
			while(--c>=0);
		}
		while(--l>=2);
		return;
	},
	//tylko na potrzeby pokazu
	loadInvaders = function() {
		
		loadTest(0);
		return;
	},
	loadPacman = function() {
		
		loadTest(1);
		return;
	},
	loadET = function() {
		
		loadTest(2);
		return;
	},
	loadSuperMario = function() {
		
		loadTest(3);
		return;
	},
	loadPong = function() {
		
		loadTest(4);
		return;
	},
	loadSecretBox = function() {
		
		loadTest(5);
		return;
	},
	loadQuake = function() {
		
		loadTest(6);
		return;
	};
oTest1.setAttribute("value",oTestEnvironment.scenarios[0][0]);
oTest2.setAttribute("value",oTestEnvironment.scenarios[1][0]);
oTest3.setAttribute("value",oTestEnvironment.scenarios[2][0]);
oTest4.setAttribute("value",oTestEnvironment.scenarios[3][0]);
oTest5.setAttribute("value",oTestEnvironment.scenarios[4][0]);
oTest6.setAttribute("value",oTestEnvironment.scenarios[5][0]);
oTest7.value = oTestEnvironment.scenarios[6][0]; //w ten sposób także działa

oLevelSelector.value = iInitialLevel;

//loadTest(6);
drawPiece(); //losuj klocek inicjujący grę
//TODO: funkcja init() musi odpalić zanim wylosuje się pierwszy klocek, bo inaczej pierwszy kock zawsze będzie klockiem O

document.addEventListener("keydown", keyboardHandler, true);
oTest1.addEventListener("click", loadInvaders, true);
oTest2.addEventListener("click", loadPacman, true);
oTest3.addEventListener("click", loadET, true);
oTest4.addEventListener("click", loadSuperMario, true);
oTest5.addEventListener("click", loadPong, true);
oTest6.addEventListener("click", loadSecretBox, true);
oTest7.addEventListener("click", loadQuake, true);

oStartGameButton.addEventListener("click", main, true);