-- Fill in real content for 4 published `activities` rows that were left as
-- placeholders from an older content schema (scenario/challenge_type/empty
-- steps), which made them unplayable in the current step-based ActivityPlayer.
--
-- Applied directly to production via Supabase MCP (this project's schema is
-- managed outside the numbered 0001-0008 migrations in this folder — see
-- `seed_activities_catalogue_v2` for the original activities seed). Mirrored
-- here for audit history.

update activities set content = $json$
{
  "steps": [
    {"type":"text","title":"Préparer sa négociation salariale","content":"Avant toute négociation, définissez trois chiffres : votre salaire actuel (ou le marché), votre objectif idéal, et votre seuil minimum acceptable. Renseignez-vous sur les grilles salariales du secteur pour argumenter avec des faits, pas des impressions."},
    {"type":"quiz","question":"Qu'est-ce que le \"BATNA\" en négociation ?","choices":["Votre meilleure alternative si l'accord échoue","Le salaire moyen du marché","Un logiciel de calcul salarial","Une clause du contrat de travail"],"correct":0,"explanation":"Le BATNA (Best Alternative To a Negotiated Agreement) est votre plan B. Plus il est solide, plus vous négociez en position de force."},
    {"type":"simulation","context":"Vous venez de recevoir une offre d'embauche. Le poste vous intéresse, mais la proposition salariale est en dessous de vos attentes.","cleo_line":"Nous sommes ravis de vous proposer ce poste. Notre offre est de 32 000€ brut annuel, c'est notre grille standard pour ce niveau d'expérience.","user_role":"Vous répondez au recruteur pour justifier une révision à la hausse, sans mettre en péril l'offre.","hint":"Remerciez, réaffirmez votre motivation, puis appuyez-vous sur un chiffre de marché ou une compétence rare pour justifier votre demande.","auto_listen":true},
    {"type":"quiz","question":"Le recruteur refuse d'augmenter le salaire de base mais propose un geste. Quelle contrepartie est la plus judicieuse à demander ?","choices":["Une prime, des jours de télétravail ou une clause de révision à 6 mois","Rien, il faut accepter tel quel","Redemander exactement la même chose en boucle","Menacer de refuser l'offre immédiatement"],"correct":0,"explanation":"Quand le salaire de base est bloqué, d'autres leviers existent : primes, avantages, formation, ou une clause de revoyure après une période d'essai réussie."}
  ]
}
$json$::jsonb
where id = '787bdd62-01cd-4f9b-9cec-94594fd13ad9';

update activities set content = $json$
{
  "steps": [
    {"type":"text","title":"Le pitch professionnel avancé","content":"Au-delà du pitch de 60 secondes, un pitch avancé suit la structure PSPA : Problème (le contexte), Solution (votre valeur ajoutée), Preuve (un résultat concret ou une expérience), Ask (ce que vous recherchez précisément). Objectif : 45 secondes, sans notes."},
    {"type":"quiz","question":"Dans la structure PSPA, à quoi sert l'étape \"Preuve\" ?","choices":["Démontrer votre valeur avec un fait concret et vérifiable","Répéter votre nom et votre formation","Lister tous vos diplômes","Remplir le temps de parole"],"correct":0,"explanation":"Une affirmation sans preuve reste abstraite. Un chiffre, un projet ou un résultat concret rend votre pitch crédible et mémorable."},
    {"type":"interview","question":"Enregistrez votre pitch professionnel complet en suivant la structure PSPA : présentez le problème que vous adressez, votre valeur ajoutée, une preuve concrète, et ce que vous recherchez. Visez 45 secondes.","hint":"Entraînez-vous à voix haute avant d'enregistrer. Un bon pitch se termine toujours par une demande claire (ce que vous cherchez : stage, poste, opportunité...).","auto_listen":true},
    {"type":"quiz","question":"Juste après votre pitch, un recruteur enchaîne avec une question inattendue. Quelle est la meilleure attitude ?","choices":["Prendre 2 secondes pour respirer, reformuler la question si besoin, puis répondre avec un exemple concret","Répondre instantanément sans réfléchir pour ne pas paraître hésitant","Éviter la question et revenir à votre pitch initial","Dire que vous ne savez pas et changer de sujet"],"correct":0,"explanation":"Un court silence pour structurer sa pensée est perçu positivement. Répondre avec un exemple concret renforce la crédibilité déjà installée par le pitch."}
  ]
}
$json$::jsonb
where id = '5fb6a3d4-cfcf-486d-aea6-81f86a62e988';

update activities set content = $json$
{
  "steps": [
    {"type":"text","title":"Python : les fondamentaux","content":"Python est un langage de programmation simple à lire, très utilisé en data, web et automatisation. Ce quiz teste vos bases : variables, types, boucles et fonctions."},
    {"type":"quiz","question":"Comment déclare-t-on une variable nommée age contenant la valeur 25 en Python ?","choices":["age = 25","int age = 25","var age = 25","age := 25;"],"correct":0,"explanation":"Python n'a pas besoin de déclarer le type : `age = 25` suffit, le type est déduit automatiquement (typage dynamique)."},
    {"type":"quiz","question":"Quel type de donnée renvoie l'expression `type(3.14)` ?","choices":["float","int","str","double"],"correct":0,"explanation":"3.14 est un nombre à virgule flottante, donc de type `float` en Python (il n'existe pas de type `double`)."},
    {"type":"quiz","question":"Que fait cette boucle : `for i in range(3): print(i)` ?","choices":["Affiche 0, 1, 2","Affiche 1, 2, 3","Affiche 3 trois fois","Provoque une erreur"],"correct":0,"explanation":"`range(3)` génère les entiers de 0 à 2 (3 exclu), donc la boucle affiche 0, 1 puis 2."},
    {"type":"quiz","question":"Comment ajoute-t-on l'élément 4 à la fin de la liste `ma_liste = [1, 2, 3]` ?","choices":["ma_liste.append(4)","ma_liste.add(4)","ma_liste.push(4)","ma_liste + 4"],"correct":0,"explanation":"La méthode `.append()` ajoute un élément à la fin d'une liste Python."},
    {"type":"fill","sentence":"En Python, un bloc de code (comme le corps d'une fonction ou d'une boucle) est délimité par une ___, pas par des accolades.","answer":"indentation","alternatives":["indentation cohérente"],"hint":"C'est ce qui rend le code Python visuellement organisé sans symboles supplémentaires.","explanation":"Python utilise l'indentation (espaces ou tabulations cohérents) pour délimiter les blocs de code, contrairement à des langages comme Java ou C qui utilisent des accolades {}."}
  ]
}
$json$::jsonb
where id = 'a835a42d-51ee-468f-938f-98fca9713532';

update activities set content = $json$
{
  "steps": [
    {"type":"text","title":"L'anatomie d'un CV impactant","content":"Un CV efficace se lit en 6 secondes lors d'un premier tri. Son ordre compte : titre du poste visé, coordonnées, expériences (les plus récentes d'abord, en résultats chiffrés plutôt qu'en tâches), formations, compétences clés. Une page suffit dans la majorité des cas."},
    {"type":"quiz","question":"Quelle formulation d'expérience est la plus impactante sur un CV ?","choices":["\"Augmentation de 20% des ventes en 6 mois grâce à une nouvelle stratégie de prospection\"","\"Chargé de la prospection commerciale\"","\"Diverses tâches commerciales\"","\"Travail en équipe sur les ventes\""],"correct":0,"explanation":"Un résultat chiffré et contextualisé est bien plus convaincant qu'une simple description de mission — il prouve votre impact concret."},
    {"type":"fill","sentence":"Le titre en haut d'un CV doit correspondre au ___ visé, pas à votre dernier intitulé de poste.","answer":"poste","alternatives":["poste visé","emploi visé"],"hint":"Pensez à ce que le recruteur cherche à pourvoir, pas à votre historique.","explanation":"Un titre aligné sur l'offre (ex : \"Chargé de communication digitale\") facilite l'identification immédiate par le recruteur, y compris via les logiciels de tri automatique."},
    {"type":"quiz","question":"Quelle erreur fait perdre le plus de crédibilité à un CV ?","choices":["Une faute d'orthographe ou une information incohérente (dates, chiffres)","Une photo professionnelle","Une mise en page sobre","Un CV d'une seule page"],"correct":0,"explanation":"Les fautes et incohérences donnent l'impression d'un manque de rigueur — un critère souvent éliminatoire dès le premier tri."}
  ]
}
$json$::jsonb
where id = 'd5fb9424-6c21-4ab3-9bb1-59b5217a076a';
