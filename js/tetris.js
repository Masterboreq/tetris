/* js/tetris.js
*/
var oEvent = window.event,
	oWell = document.getElementById("well"),
	
	oTest1 = document.getElementById("test1"),
	oTest2 = document.getElementById("test2"),
	oTest3 = document.getElementById("test3"),
	oTest4 = document.getElementById("test4"),
	oTest5 = document.getElementById("test5"),
	oTest6 = document.getElementById("test6"),
	oTest7 = document.getElementById("test7"),
	
	//rzędy studzienki jako potomkowie elementu #well o klasie "row"
	oRows = oWell.getElementsByClassName("row"),
	
	//klocki	
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
		aActualTopLeft:  [0,4], //aActualTopLeft zawiera BEZWGLĘDNE współrzędne [Y,X] względem lewego, górnego narożnika studzienki
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
		aActualTopLeft:  [0,4],
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
		aActualTopLeft:  [0,4],
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
		aActualTopLeft:  [0,4],
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
		aActualTopLeft:  [0,4],
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
		aActualTopLeft:  [0,4],
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
		aActualTopLeft:  [0,4], //[Y,X] !!
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
		- funkcja render() podczas etapu [TO DO: ] czyszczenia (zanikania) kompletnych rzędów segmentów studzienki.	
	*/
	bClearRows = false,
	/*
		Flaga głównej pętli programu informująca, czy w danym momencie rozgrywki występuje sytuacja, w której osadzony klocek zapełnił jedną lub więcej rzędów studzienki.
		JEŚLI ustawiona na TRUE, uruchamia się funkcja clearRows().
		Flagę modyfikuje fumkcja land().
	*/
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
	};

//spajanie rzędów i komórek w jeden obiekt, którego elementy można łatwo adresować i po nich iterować
oRows.row = [];
j=0;
do {
	oRows.row.push(oRows[j].getElementsByClassName("cell"));
}
while(oRows[++j]);

var sCellBorderColor = oRows.row[0][0].style.borderColor;

	//### Funkcje ###
var spawnPiece = function() {
		/* Ustawia klocek w jego początkowej pozycji w studzience
		 i początkowej orientacji
		 
		 ### Zwracane wartości ###
			FALSE w przypadku możliwości stworzenia nowego klocka; TRUE w przeciwnym przypadku, co oznacza koniec gry.
		*/
		
		aTrialTopLeft = [0,5]; //ustawienie miejsca testowego
		iTrialOrientation = 0;
		if(detectCollision()) {
			console.log("Game over!");
			return true;
		}
		render();
		return false;
	},
	drawPiece = function() {
		/* Losuje nowy klocek, który pojawi się na górze studzienki */
		iNumber = Math.floor((Math.random()*1293)%7);
		oActualPiece = aPieces[iNumber];
		spawnPiece();
		return;
	},
	stepDown = function() {
		console.log("W dół!");
		
		aTrialTopLeft = oActualPiece.aActualTopLeft.slice(); //konieczenie kopiujemy tablicę metodą, bo inaczej stworzymy tylko wskaźnik na kopiowany obiekt!
		//console.log("TTL po: "+aTrialTopLeft);
		aTrialTopLeft[0]++;
		if(aTrialTopLeft[0]>19) {
			//down&dirty hack!
			aTrialTopLeft[0] = 19;
			console.log("Uwaga! Koniec studzienki!");
			//return;
		}
		if(bLandCondition) {
			land();
			if(bClearRows) {
				clearRows();
			}
			drawPiece();
		}
		if(detectCollision()) {
			//UWAGA! Wewnątrz tej instrukcji warunkowej NIE powinna (choć może) zachodzić obsługa lądowania klocka!
			//bLandCondition = false; // TO DO: potestuj, czy to działa poprawnie w każdej sytuacji!
			return;
		}
		//console.log("Rendering");
		render();
		return;
	},
	
	stepSide = function(bDirection) {
		/* Jedna funkcja, która w zależności od przekazanego argumentu, przesuwa klocek w lewo (0) lub w prawo (1)
		*/
		var i = -1; //ruch w lewo
		
		if(bDirection) {
			i = 1; //ruch w prawo
			console.log("W prawo!");
		}
		else {
			console.log("W lewo!");
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
	}
	movePiece = function(oEvent) {
		//obługa klawiatury dla ruchu klocków. Być może trzeba zmienić nazwę tej funkcji
		switch(oEvent.keyCode) {
			//Przesuwanie klocka w lewo
			case 37:	stepSide(0);
			break;
			//Obrót klocka (zawsze przeciwnie do ruchu wskazówek zegara)
			case 38:	flipPiece();
			break;
			//Przesuwanie klocka w prawo
			case 39: stepSide(1);
			break;
			//Przesuwanie klocka w dół
			case 40:	stepDown();
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
		 
		 Algorytm
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
		r = 3; //czwarty (najniższy) rząd klocka
			 
		//pętla detekcji kolizji
		do {
			c = 3; //czwarty od lewej segment klocka
			offsetY = aTrialTopLeft[0]+r; //współrzędna bezwględna Y
			do {
				offsetX = aTrialTopLeft[1]+c; //współrzędna bezwględna X
				oRow = oRows.row[offsetY][offsetX];
				occupied = oRow.getAttribute("occupied")*1;
				//console.log(occupied);
				if(occupied==1 && oActualPiece.orientations[iTrialOrientation][r][c]==1) {
					console.log("Kolizja przy Y:"+offsetY+"; X:"+offsetX+" Wynik: "+occupied);
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
			console.log("Ruch dozwolony.");
			
			// ### TUTAJ DETEKCJA stanu lądowania
			bLandCondition = false; //reset stanu land condition
			r = 4; //czwarty rząd poniżej klocka
			do {
				c = 3; //czwarty od lewej segment oActualPiece.aActualTopLeft[0] klocka
				offsetY = oActualPiece.aActualTopLeft[0]+r; //współrzędna bezwględna Y
				do {
					offsetX = oActualPiece.aActualTopLeft[1]+c; //współrzędna bezwględna X
					oRow = oRows.row[offsetY][offsetX];
					occupied = oRow.getAttribute("occupied")*1;
					cellState = oActualPiece.orientations[oActualPiece.actualOrientation][r-1][c]*1;
					if(occupied==1 && cellState==1) {
						console.log("Land condition przy Y:"+offsetY+"; X:"+offsetX);
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
			console.log("Niedozwolony ruch!");
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
		//console.log("Renderer: "+offsetY);
		// ### Pętla czyszczenia komórek studzienki po poprzednim położeniu klocka ###
		do {
			//pętla rzędów: iterujemy przez 5 rzędów
			//offsetY = r + oActualPiece.aActualTopLeft[0]; //TO DO: to jest do wywalenia?
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
		//TO DO: sprawdzić, jak przepisanie tablicy dwuwymiarowej do nowej zmiennej wpływa na sprawność działania skryptu
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
					oRows.row[offsetY][offsetX+c].style.border = "1px dashed #bbb";
				}
			}
			while(++c<=3);
		}
		while(++r<=3);
		return;
	},
	clearRows = function() {
		/* Funkcja czyści kompletne rzędy studzienki oraz przenosi wszystkie wypełnione (osadzone) komórki studzienki o tyle rzędów niżej, ile to możliwe.
		UWAGA! Ta funkcja jest rodzajem RENDERERA.
		*/
		
		//znajdź i wyczyść kompletne rzędy
		var r = oActualPiece.aActualTopLeft[0], //licznik rzędów; zaczynamy od najwyższego rzędu klocka
			i = 4, //ogranicznik maks. ilości czyszczonych rzędów do 4 (kolejny, sprytny hack)
			oNewRow = oRows[1].cloneNode(true); //klonowanie pierwszego rzędu studzienki wraz z jego komórkami
			
		//pętla usuwania kompletnych rzędów studzienki
		do {
			if(aRowCompleteness[r]==10) { //aRowCompleteness przechowuje informację o ilości wypełnionych segmentów w każdym z 20 rzędów studzienki
				/*oRows.row[r][2].style.backgroundColor = "#fff";
				oRows.row[r][3].style.backgroundColor = "#fff";
				oRows.row[r][4].style.backgroundColor = "#fff";
				oRows.row[r][5].style.backgroundColor = "#fff";
				oRows.row[r][6].style.backgroundColor = "#fff";
				oRows.row[r][7].style.backgroundColor = "#fff";
				oRows.row[r][8].style.backgroundColor = "#fff";
				oRows.row[r][9].style.backgroundColor = "#fff";
				oRows.row[r][10].style.backgroundColor = "#fff";
				oRows.row[r][11].style.backgroundColor = "#fff";*/
				oWell.removeChild(oRows[r]); //usuwanie kompletnego rzędu
				oWell.insertBefore(oNewRow, oRows[1]);
				oRows[1] = oRows[2];
			}
			if(++r>20) {
				//hack! Nie ma sensu kontynuować pętli powyżej rzędu 20.
				break;
			}
			 
		}
		while(--i>0);
		
		//pętla renumeracji atrybutu id każdego z aktywnych rzędów studzienki
		var sIdString = "";
		r--; //korekta r z 21 na 20
		do {
			sIdString = "row-";
			sIdString += r;
			oRows[r].setAttribute("id", sIdString);
			//oRow.row[r] = 
			console.log("Rząd "+r+" id="+oRows[r].getAttribute("id"));
		}
		while(--r>0);
		
		bClearRows = false;
		return;
	},
	land = function() {
		r = 3; //czwarty rząd poniżej klocka
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
						console.log("Rząd "+offsetY+" jest gotowy do skasowania!");
					}
					else {
						console.log("Rząd "+offsetY+" ma teraz "+aRowCompleteness[offsetY]+" element(ów)");
					}
				}
			}
			while(c--);
			r--;
		}
		while(r>=0);
		bLandCondition = false; //zerowanie land condition
		console.log("Orzeł wylądował!");
		return;
	}
	
	
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
oTest7.setAttribute("value",oTestEnvironment.scenarios[6][0]);

//loadTest(6);
drawPiece(); //losuj klocek inicjujący grę

document.addEventListener("keydown", movePiece, true);
oTest1.addEventListener("click", loadInvaders, true);
oTest2.addEventListener("click", loadPacman, true);
oTest3.addEventListener("click", loadET, true);
oTest4.addEventListener("click", loadSuperMario, true);
oTest5.addEventListener("click", loadPong, true);
oTest6.addEventListener("click", loadSecretBox, true);
oTest7.addEventListener("click", loadQuake, true);

