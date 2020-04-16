const SRC_QUESTIONS = "https://5mdbeq0iwdfqabpt1voyfg-on.drv.tw/Quiz%20feu/quizMarde.txt";
const DIRECTOIRE = "https://5mdbeq0iwdfqabpt1voyfg-on.drv.tw/Quiz%20feu/";
const LISTE_QUIZ_DOC = "listeQuiz5.txt";
const NBR_ELEMS_QUESTION = 9;
const NBR_ELEMS_QUIZ = 4;
    
//Modèle
class Jeu
{
	constructor(listeQuiz, scoreDebut = 0, listeQuizFaits = [])
    {
	    alert("marde");
    	this.listeQuiz = listeQuiz;
    	this.score = scoreDebut;
        this.listeQuizFaits = listeQuizFaits;
        this.quizActif = null;
    }
    
    getQuizActif()
    {
    	return this.quizActif;
    }
    
    setQuizActif(idQuiz)
    {
    	this.quizActif = this.listeQuiz[idQuiz]; 
    }
}

class Quiz
{
	constructor(id, titre, questions, description = "", image = "", highscore = 0)
    {    
    		this.id = id;
        this.titre = titre;
        this.questions = questions;
        this.highscore = highscore;
        this.score = 0;
        this.questionActive = null;
    }
    
  	quizChoisi(idQuiz)
    {
    	jeu.setQuizChoisi(idQuiz);
    }
    
    reponseChoisie(reponse)
    {
        if (this.questionActive.validerReponse(reponse))
        {
        	this.score ++;
        }
    }
    
    questionSuivante()
    {
    	if(this.questions.length > 0)
        {
        	var nombreHasard = this.questions.length * Math.random() | 0;
			this.questionActive = this.questions[nombreHasard];
    		this.questions.splice(nombreHasard, 1);
    	}
        else
        {
        	this.finirQuiz();
        }
    }
    
    finirQuiz()
    {
    	this.questionActive = null;
    }
    
    getQuestionActive()
    {
    	return this.questionActive;
    }
    
    getScore()
    {
    	return this.score;
    }
    
    getId()
    {
    	return this.id;
    }
    
    getTitre()
    {
    	return this.titre;
    }
    
    setQuestions(listeQuestions)
    {
    	this.questions = listeQuestions;
    }
}

class Question {
	
    constructor(id, titre, imgGauche, imgCentre, imgDroite, reponse, descGauche, descCentre, descDroite)
	{
    	this.titre = titre;
        this.id = id;
        this.imgGauche = imgGauche;
        this.imgCentre = imgCentre;
        this.imgDroite= imgDroite;
        this.reponse = reponse;
        this.descGauche = descGauche;
        this.descCentre = descCentre;
        this.descDroite = descDroite;
    }
    
    validerReponse(image)
    {
    	return (image == this.reponse);
    }
    
    getReponse()
    {
    	return this.reponse;
    }
    
    getInfos()
    {
        return {titre: this.titre, imgGauche: this.imgGauche, imgCentre: this.imgCentre, imgDroite: this.imgDroite, reponse: this.reponse, descGauche: this.descGauche, descCentre: this.descCentre, descDroite: this.descDroite};
    }
}

//Présentateur
class Presentateur
{
    constructor()
    {        
        this.vue = new MainVue(this);
        this.jeu = new Jeu(this.getListeQuiz());
        
        //Test ----
        this.jeu.setQuizActif(0);        
        //-----
        
        this.debuterQuiz();
    }
    
    debuterQuiz()
    {
    	this.questionSuivante();
      var quizActuel = this.jeu.getQuizActif();
    	this.vue.debuterQuiz(quizActuel.getId(), quizActuel.getTitre());
    }
    
    questionSuivante()
    {
    	 this.jeu.getQuizActif().questionSuivante();
        if(this.jeu.getQuizActif().getQuestionActive() != null)
        {
        	var infos = this.jeu.getQuizActif().getQuestionActive().getInfos();
    		this.vue.getVueQuiz().questionSuivante(infos.titre, infos.imgGauche, infos.imgCentre, infos.imgDroite, infos.descGauche, infos.descCentre, infos.descDroite);
    	}
        else
        {
			this.finirQuiz();
        }
    }
    
    reponseChoisie(image)
    {
    	this.jeu.getQuizActif().reponseChoisie(image);
    	this.vue.getVueQuiz().reponseChoisie(this.jeu.getQuizActif().getQuestionActive().getReponse(), this.jeu.getQuizActif().getScore());
    }
    
    finirQuiz()
    {
    	this.vue.getVueQuiz().finirQuiz(this.jeu.getQuizActif().getScore());
    }
    
	//Retourne array[Question]
	getQuestions(file)
	{
  	var file = "https://5mdbeq0iwdfqabpt1voyfg-on.drv.tw/Quiz%20feu/aspartame2.txt";
  	var allText = "erreur";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
    	      if(rawFile.readyState === 4)
     	   {
         
     	       if(rawFile.status === 200 || rawFile.status == 0)
     	       {
     	           allText = rawFile.responseText;
             }
     	   }
    	}
    	rawFile.send();
			var tableauQuestions = [];
			var strQuestions = allText.split(",");
			for (let i = 0; i < (strQuestions.length/NBR_ELEMS_QUESTION-1); i++) 
			{
				var tableauTemp = [];
				for(let x = 0; x < NBR_ELEMS_QUESTION; x++)
 		  	{
  				tableauTemp.push(strQuestions[(i*NBR_ELEMS_QUESTION)+x]);
  			}
			tableauQuestions.push(tableauTemp);
		}
    var listeQuestions = [];
        for (var e of tableauQuestions)
        {
        	listeQuestions.push(new Question(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8]));
        }
    return listeQuestions;
	}
  
  //Retourne array[Quiz]
	getListeQuiz(file = "https://5mdbeq0iwdfqabpt1voyfg-on.drv.tw/Quiz%20feu/listeQuiz4.txt")
	{
  	var allText = "erreur";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
      if(rawFile.readyState === 4)
     	   {
     	       if(rawFile.status === 200 || rawFile.status == 0)
     	       {
             	   allText = rawFile.responseText;
     	       }
     	   }
    	}
    	rawFile.send(null);
			var tableauQuiz = [];
			var strQuiz = allText.split(",");
			for (let i = 0; i < (strQuiz.length/NBR_ELEMS_QUIZ-1); i++) 
			{
				var tableauTemp = [];
				for(let x = 0; x < NBR_ELEMS_QUIZ; x++)
 		  	{

  				tableauTemp.push(strQuiz[(i*NBR_ELEMS_QUIZ)+x]);
  			}
        tableauQuiz.push(tableauTemp);
        			}
    var listeQuiz = [];
    for (var e of tableauQuiz)
    {
    		var questionsTemp = this.getQuestions(DIRECTOIRE + e[0] + ".txt");
        listeQuiz.push(new Quiz(e[0], e[1], questionsTemp, e[2], e[3]));
        alert(questionsTemp.length);
    }
    return listeQuiz;
	}
}

const LARGEUR_QUESTION = 200;
const HAUTEUR_QUESTION = 200;
const LARGEUR_BOUTON_QUESTION_SUIVANTE = 200;
const HAUTEUR_BOUTON_QUESTION_SUIVANTE = 200;
const BOUTON_QUESTION_SUIVANTE = "https://gamepedia.cursecdn.com/theforest_gamepedia/thumb/7/70/MolotovFarket.png/250px-MolotovFarket.png?version=1f2df7e8a5f065de372e81a8294003fe";
const IMG_VICTOIRE = "https://scontent.fyhu2-1.fna.fbcdn.net/v/t1.0-9/54279432_412034336025203_2564982352098885632_n.jpg?_nc_cat=108&_nc_ohc=FHmgHLkXNuMAX8bLg31&_nc_ht=scontent.fyhu2-1.fna&oh=4236da9122fd3ca2cc3f42738e8f0e72&oe=5E9532BD";

class MainVue
{
	constructor(presentateur)
    {
    	this.vueQuiz = new VueQuiz(presentateur);     
        this.presentateur = presentateur;
    }
    
    debuterQuiz(titre, id)
    {
    	this.vueQuiz.debuterQuiz(titre, id);
    }
    
    getVueQuiz()
    {
    	return this.vueQuiz;
    }
}

class VueQuiz
{
	constructor(presentateur)
    {
    	this.presentateur = presentateur;
      this.directoire = "";
    	document.getElementById("boutonQuestionSuivante").src = BOUTON_QUESTION_SUIVANTE;
        document.getElementById("boutonQuestionSuivante").width = LARGEUR_BOUTON_QUESTION_SUIVANTE;
        document.getElementById("boutonQuestionSuivante").height = HAUTEUR_BOUTON_QUESTION_SUIVANTE;
        
        document.getElementById("imgGauche").width =  HAUTEUR_QUESTION;
       	document.getElementById("imgCentre").width = HAUTEUR_QUESTION;
       	document.getElementById("imgDroite").width = HAUTEUR_QUESTION;
        document.getElementById("imgGauche").height = HAUTEUR_QUESTION;
        document.getElementById("imgCentre").height = HAUTEUR_QUESTION;
        document.getElementById("imgDroite").height = HAUTEUR_QUESTION;
    }
    
    debuterQuiz(id, titre)
    {
    	document.getElementById("boutonQuestionSuivante").onclick = this.presentateur.questionSuivante.bind(this.presentateur, null);
      document.getElementById("titreQuiz").innerHTML = titre;
      this.directoire = id + "/";
    	
      }
    
    
    reponseChoisie(bonneReponse, score)
    {
    	this.changerScore(score);
        document.getElementById("boutonQuestionSuivante").style.visibility = "visible";
        
        if (bonneReponse == 1)
    	{
    		document.getElementById("imgCentre").style.opacity = "0.5";
        	document.getElementById("imgDroite").style.opacity = "0.5";
   		}
    	else if (bonneReponse == 2)
    	{
    	document.getElementById("imgGauche").style.opacity = "0.5";
        document.getElementById("imgDroite").style.opacity = "0.5";
    	}
    	else if (bonneReponse == 3)
    	{
        	document.getElementById("imgGauche").style.opacity = "0.5";
       		document.getElementById("imgCentre").style.opacity = "0.5";
    	}
        
		document.getElementById("imgGauche").onclick = null;
        document.getElementById("imgCentre").onclick = null;
        document.getElementById("imgDroite").onclick = null; 
        
		document.getElementById("descGauche").style.visibility = "visible";
        document.getElementById("descCentre").style.visibility = "visible";
        document.getElementById("descDroite").style.visibility = "visible";
    }
    
    questionSuivante(titre, imgGauche, imgCentre, imgDroite, descGauche, descCentre, descDroite)
    {
        document.getElementById("boutonQuestionSuivante").style.visibility = "hidden"; 
        
        document.getElementById("imgGauche").style.opacity = "1";
       	document.getElementById("imgCentre").style.opacity = "1";
       	document.getElementById("imgDroite").style.opacity = "1";

        document.getElementById("imgGauche").onclick = this.presentateur.reponseChoisie.bind(this.presentateur, 1);
        document.getElementById("imgCentre").onclick = this.presentateur.reponseChoisie.bind(this.presentateur, 2);
        document.getElementById("imgDroite").onclick = this.presentateur.reponseChoisie.bind(this.presentateur, 3);
    
    		document.getElementById("titre").textContent = titre;
        
        
        document.getElementById("imgDroite").src = imgDroite;
        document.getElementById("imgGauche").src = imgGauche;
       	document.getElementById("imgCentre").src = imgCentre;
    		//document.getElementById("imgGauche").src = DIRECTOIRE + this.directoire + imgGauche + ".jpg";
       	//document.getElementById("imgCentre").src = DIRECTOIRE + this.directoire + imgCentre + ".jpg";
       	//document.getElementById("imgDroite").src = DIRECTOIRE + this.directoire + imgDroite + ".jpg";
        
        document.getElementById("descGauche").style.visibility = "hidden";
        document.getElementById("descCentre").style.visibility = "hidden";
        document.getElementById("descDroite").style.visibility = "hidden";
        document.getElementById("descGauche").textContent = descGauche;
        document.getElementById("descCentre").textContent = descCentre;
        document.getElementById("descDroite").textContent = descDroite;
    }
    
    changerScore(score)
    {
    	document.getElementById("score").textContent = "Score : " + score;
    }
    
    finirQuiz(score)
    {
    	document.getElementById("descGauche").style.visibility = "hidden";
        document.getElementById("descCentre").style.visibility = "hidden";
        document.getElementById("descDroite").style.visibility = "hidden";
    
    	document.getElementById("titre").textContent = "Score final : " + score;
        document.getElementById("boutonQuestionSuivante").onclick = null;
        
        document.getElementById("imgGauche").style.opacity = "1";
       	document.getElementById("imgCentre").style.opacity = "1";
       	document.getElementById("imgDroite").style.opacity = "1";
        document.getElementById("imgGauche").src = IMG_VICTOIRE;
       	document.getElementById("imgCentre").src = IMG_VICTOIRE;
       	document.getElementById("imgDroite").src = IMG_VICTOIRE;
    }
}
