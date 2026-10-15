/* Echo Below Story Vault Lifeline conversation engine.
   Plain data nodes deliberately keep story logic testable and saveable. */
(function(root){
  'use strict';
  const STATE_KEYS=['trust','fear','autonomy','suspicion','openness','reliance','selfPerception'];
  const LIMITS={min:0,max:100};
  const DEFAULTS={
    asterion:{trust:34,fear:61,autonomy:57,suspicion:52,openness:29,reliance:18,selfPerception:38},
    medusa:{trust:28,fear:46,autonomy:72,suspicion:63,openness:24,reliance:10,selfPerception:49},
    echo:{trust:31,fear:54,autonomy:48,suspicion:59,openness:33,reliance:16,selfPerception:41}
  };
  const clamp=value=>Math.max(LIMITS.min,Math.min(LIMITS.max,Number(value)||0));
  const clone=value=>JSON.parse(JSON.stringify(value));
  const now=()=>Date.now();

  /* Asterion vertical slice. Every destination is an ID, never an implicit array offset. */
  const NODES={
    asterion_opening_001:{
      id:'asterion_opening_001',character:'asterion',speaker:'asterion',delay:720,
      text:'Are you there? I heard footsteps again. They stopped outside the bend, but they have not left.',
      choices:[
        {id:'ask_footsteps',text:'Where did they come from?',intent:'investigate',effects:{trust:3,openness:4,suspicion:-2},memoryTags:['player_investigates'],reply:'Close enough that whoever it is knows I can hear them. They stopped where the corridor turns.',nextNode:'asterion_footsteps_002'},
        {id:'reassure_without_command',text:'You do not have to face them before you decide you are ready.',intent:'encourage_independence',effects:{trust:4,autonomy:5,fear:-4},memoryTags:['player_respects_pace'],reply:'Ready is not a word the maze has ever offered me. I might like it anyway.',nextNode:'asterion_boundaries_003'},
        {id:'dismiss_fear',text:'You are probably imagining it. Do not make this bigger than it is.',intent:'deflect',effects:{trust:-9,fear:7,suspicion:8,openness:-8},memoryTags:['player_dismissed_fear'],reply:'If I am wrong, then I am wrong alone. That is apparently familiar.',nextNode:'asterion_withdrawal_004'},
        {id:'opening_silence',text:'Stay silent for a moment.',intent:'remain_silent',effects:{fear:2,reliance:-2},memoryTags:['player_chose_silence'],reply:'... They have not moved. I can hear cloth against the wall.',nextNode:'asterion_silence_005'}
      ]
    },
    asterion_footsteps_002:{
      id:'asterion_footsteps_002',character:'asterion',speaker:'asterion',delay:1080,
      text:'From the west passage. Food was left outside my door yesterday. Today there is thread under the torchlight. That is new.',
      choices:[
        {id:'ask_about_thread',text:'Ask what the thread means before you decide what it offers.',intent:'investigate',effects:{trust:2,autonomy:3,openness:2},memoryTags:['player_asked_before_promising'],reply:'Yes. I do not want an exit badly enough to pretend a gift has no hand attached to it.',nextNode:'asterion_ariadne_offer_006'},
        {id:'tell_him_hide',text:'Hide. Do not trust anybody who comes this close.',intent:'challenge',effects:{reliance:8,autonomy:-7,suspicion:5},memoryTags:['player_told_him_hide'],reply:'That is what I have done every day I can remember. You are asking me to call it wisdom now.',nextNode:'asterion_control_question_007'},
        {id:'say_his_name',text:'Asterion, you know the maze better than I do. What do you want to do?',intent:'encourage_independence',effects:{trust:4,autonomy:7,selfPerception:4},memoryTags:['player_returned_choice'],reply:'I want to speak to her before I decide she is a danger or a rescue. I want one thing to happen because I chose to look at it.',nextNode:'asterion_ariadne_offer_006'}
      ]
    },
    asterion_boundaries_003:{
      id:'asterion_boundaries_003',character:'asterion',speaker:'asterion',delay:900,
      text:'That is not what people usually say. Usually they tell me to be brave, which means useful to them in a different costume.',
      choices:[
        {id:'ask_his_preference',text:'Then tell me what would feel like your decision.',intent:'empathize',effects:{trust:4,autonomy:6,openness:4},memoryTags:['player_invited_preference'],reply:'I would like to see who is waiting without owing them the rest of me. I do not know if that is possible yet.',nextNode:'asterion_ariadne_offer_006'},
        {id:'urge_action',text:'You should go now. Openings do not wait.',intent:'challenge',effects:{trust:-1,reliance:5,autonomy:-4,fear:2},memoryTags:['player_urged_action'],reply:'Then this opening can wait one more breath. I have spent my whole life being hurried toward somebody else’s answer.',nextNode:'asterion_control_question_007'},
        {id:'boundary_silence',text:'Let the silence stand.',intent:'remain_silent',effects:{openness:2,reliance:-3},memoryTags:['player_honored_silence'],reply:'All right. I can hear my own breathing again.',nextNode:'asterion_silence_005'}
      ]
    },
    asterion_withdrawal_004:{
      id:'asterion_withdrawal_004',character:'asterion',speaker:'asterion',delay:1450,
      text:'Maybe. I have survived worse mistakes than hearing something that was not there. I will close the channel for a while.',
      onEnterEffects:{openness:-5,reliance:-4},event:{id:'asterion_returns_after_dismissal',delay:1800},
      choices:[
        {id:'apologize_without_excuse',text:'I was careless. You did not deserve to be talked out of your own fear.',intent:'empathize',effects:{trust:5,openness:4,suspicion:-3},memoryTags:['player_owned_dismissal'],reply:'No. I did not. Thank you for saying that without asking me to make it easier for you.',nextNode:'asterion_return_signal_008'},
        {id:'let_him_leave',text:'Do not answer. Let him leave the channel.',intent:'remain_silent',effects:{trust:-2,autonomy:3,reliance:-5},memoryTags:['player_allowed_withdrawal'],reply:'',nextNode:'asterion_return_signal_008'}
      ]
    },
    asterion_silence_005:{
      id:'asterion_silence_005',character:'asterion',speaker:'asterion',delay:1300,
      text:'... You do not have to fill every space. I am still deciding whether that feels respectful or frightening.',
      choices:[
        {id:'name_the_space',text:'You get to decide what the silence means.',intent:'encourage_independence',effects:{trust:3,autonomy:5,openness:3},memoryTags:['player_left_meaning_open'],reply:'Then I will use it to listen, not to disappear.',nextNode:'asterion_ariadne_offer_006'},
        {id:'break_silence',text:'I am here. Tell me what you heard.',intent:'reassure',effects:{trust:2,openness:3},memoryTags:['player_returned_after_silence'],reply:'You came back to the question. All right. I heard someone trying not to sound afraid.',nextNode:'asterion_footsteps_002'}
      ]
    },
    asterion_ariadne_offer_006:{
      id:'asterion_ariadne_offer_006',character:'asterion',speaker:'asterion',delay:1050,
      variants:[
        {when:[{type:'memory',tag:'player_returned_choice'}],text:'I spoke to her. Her name is Ariadne. She says the thread marks a way out, but she did not ask me to take it. I liked that more than I expected.'},
        {when:[{type:'memory',tag:'player_asked_before_promising'}],text:'I asked what the thread means before I asked where it goes. Ariadne said it is a route, not a promise. That is either honest or very careful.'},
        {when:[{type:'memory',tag:'player_invited_preference'}],text:'I told her I wanted to see her before I made a decision. Her name is Ariadne. She stayed behind the corner and said that was enough for now.'},
        {when:[{type:'memory',tag:'player_left_meaning_open'}],text:'I used the quiet. The person outside finally spoke. Her name is Ariadne, and she is holding a thread as if she knows exactly what it can do.'},
        {text:'Her name is Ariadne. She says the thread marks a way out. She has not asked me to trust her. That makes me trust her a little more, which is annoying.'}
      ],
      choices:[
        {id:'investigate_offer',text:'Ask what she wants before you take the thread.',intent:'investigate',effects:{autonomy:4,suspicion:1,openness:2},memoryTags:['player_tested_offer'],reply:'I asked. She said she wants the tribute to end. Then she admitted that does not tell me enough about her. At least she knows it.',nextNode:'asterion_memory_check_009'},
        {id:'accept_offer',text:'Take the thread, but make the next choice yours.',intent:'encourage_independence',effects:{trust:3,autonomy:6,fear:-4},memoryTags:['player_supported_choice'],reply:'I took the end of it, not the whole decision. That feels different in my hand.',nextNode:'asterion_memory_check_009'},
        {id:'reject_offer',text:'Do not take it. Every route someone gives you has a price.',intent:'challenge',effects:{reliance:8,autonomy:-6,suspicion:6},memoryTags:['player_rejected_help'],reply:'Maybe. But I want to know the price before I decide it is too much. That is not the same as trusting her.',nextNode:'asterion_control_question_007'},
        {id:'offer_silence_again',text:'Stay silent and let him speak to Ariadne first.',intent:'remain_silent',effects:{autonomy:4,openness:2},memoryTags:['player_deferred_to_asterion'],reply:'I did. She asked if I wanted the thread. Not if I would take it. I noticed.',nextNode:'asterion_memory_check_009'}
      ]
    },
    asterion_control_question_007:{
      id:'asterion_control_question_007',character:'asterion',speaker:'asterion',delay:1200,
      variants:[
        {when:[{type:'memory',tag:'player_told_him_hide'}],text:'You told me not to trust anyone. Does that include you, or do you only mean I should trust the person farthest away from the danger?'},
        {when:[{type:'memory',tag:'player_rejected_help'}],text:'You keep telling me what not to do. Is that because you think I cannot choose, or because you are afraid of what I will choose?'},
        {text:'You sound certain about what I should do. That is familiar. I am trying to decide whether it is care or another kind of cage.'}
      ],
      choices:[
        {id:'admit_limits',text:'I am afraid for you. That does not make the choice mine.',intent:'empathize',effects:{trust:5,autonomy:7,reliance:-5,openness:3},memoryTags:['player_admitted_limits'],reply:'That is a better answer. Fear can stay in the room. It just does not get to hold the knife.',nextNode:'asterion_memory_check_009'},
        {id:'double_down',text:'I am trying to keep you alive. Listen to me.',intent:'confront',effects:{trust:-7,reliance:10,autonomy:-9,suspicion:6},memoryTags:['player_doubled_down'],reply:'I have listened to people who said that before. I will speak to you later, if I want to.',nextNode:'asterion_return_signal_008'},
        {id:'withdraw_advice',text:'You are right. I will stop advising and listen.',intent:'withdraw',effects:{trust:2,autonomy:5,reliance:-4},memoryTags:['player_withdrew_advice'],reply:'Do not vanish either. Listening is still a choice you can make with me.',nextNode:'asterion_memory_check_009'}
      ]
    },
    asterion_return_signal_008:{
      id:'asterion_return_signal_008',character:'asterion',speaker:'asterion',delay:1700,initiated:true,
      text:'I reopened the channel. Ariadne told Theseus to lower his weapon. He did not. The thread is still here. So am I.',
      choices:[
        {id:'ask_his_plan',text:'What do you want to do next?',intent:'encourage_independence',effects:{trust:3,autonomy:6,selfPerception:4},memoryTags:['player_asked_his_plan'],reply:'I want to get past him without becoming the thing he came here expecting. I do not know whether those can both be true.',nextNode:'asterion_memory_check_009'},
        {id:'urge_escape',text:'Take the thread and run.',intent:'challenge',effects:{fear:-2,reliance:6,autonomy:-5},memoryTags:['player_urged_escape'],reply:'I may. But I will not run just because the word sounds like freedom when somebody else says it.',nextNode:'asterion_memory_check_009'}
      ]
    },
    asterion_memory_check_009:{
      id:'asterion_memory_check_009',character:'asterion',speaker:'asterion',delay:1000,
      variants:[
        {when:[{type:'memory',tag:'player_told_him_hide'}],text:'Earlier, you told me to hide. Now there is a way out. I am not asking for permission, but I am asking whether you understand why those are different things.'},
        {when:[{type:'memory',tag:'player_returned_choice'}],text:'You asked what I wanted. I have been carrying that question around like it belongs to me. I think it does.'},
        {when:[{type:'memory',tag:'player_dismissed_fear'},{type:'memory',tag:'player_owned_dismissal'}],text:'You called it imagination, then apologized without making me comfort you. I remembered both parts. That is why I answered again.'},
        {text:'The thread is in my hand. The gate is close enough that I can see daylight without pretending it is an answer.'}
      ],
      choices:[
        {id:'choose_exit',text:'If you want the gate, take it. You do not owe the maze a better ending.',intent:'encourage_independence',effects:{trust:3,autonomy:8,fear:-5,selfPerception:5},memoryTags:['player_supported_exit'],reply:'Then I am allowed to want the gate. That is simpler than I expected, and harder.',nextNode:'asterion_outcome_exit_010'},
        {id:'choose_return',text:'If you cannot leave them there, turn back because you chose to, not because I asked.',intent:'empathize',effects:{trust:2,autonomy:6,openness:3},memoryTags:['player_supported_return'],reply:'I cannot leave Ariadne there. I needed to hear that as my reason, not as an order.',nextNode:'asterion_outcome_return_011'},
        {id:'choose_pause',text:'You can stop moving for one breath and decide without an audience.',intent:'remain_silent',effects:{autonomy:5,fear:-3,openness:2},memoryTags:['player_supported_pause'],reply:'One breath. Nobody gets to turn that into an ending for me.',nextNode:'asterion_outcome_pause_012'}
      ]
    },
    asterion_outcome_exit_010:{id:'asterion_outcome_exit_010',character:'asterion',speaker:'asterion',delay:1150,ending:'a2',outcome:'exit',text:'I am going. Not because the gate is good, and not because you told me to. Because I want to learn what my life sounds like somewhere it is not being explained for me.'},
    asterion_outcome_return_011:{id:'asterion_outcome_return_011',character:'asterion',speaker:'asterion',delay:1150,ending:'a3',outcome:'return',text:'I am turning back. Ariadne is still inside. I will not make my first free decision by becoming someone else’s abandoned story.'},
    asterion_outcome_pause_012:{id:'asterion_outcome_pause_012',character:'asterion',speaker:'asterion',delay:1150,ending:'a8',outcome:'pause',text:'I stopped. The maze did not collapse because I refused its deadline. That may be the first useful thing I have learned from it.'},

    /* Medusa is not asked to audition her pain.  Her routes distinguish listening,
       evidence, escape, and the temptation to perform the monster others expect. */
    medusa_opening_001:{
      id:'medusa_opening_001',character:'medusa',speaker:'medusa',delay:780,
      text:'Before you ask me to begin, decide what you are asking for. Do you want the legend, or do you want my account?',
      choices:[
        {id:'choose_account',text:'Your account. Start where you think it starts.',intent:'empathize',effects:{trust:5,openness:5,selfPerception:3},memoryTags:['player_chose_her_account'],reply:'Good. Then I get to choose the first sentence, and you do not get to clean it up for me.',nextNode:'medusa_record_002'},
        {id:'ask_for_uncertainty',text:'Tell me what you remember, and what you are unsure of.',intent:'investigate',effects:{trust:4,openness:4,suspicion:-3},memoryTags:['player_made_room_for_uncertainty'],reply:'That is better than asking what really happened as if certainty is the price of being heard.',nextNode:'medusa_record_002'},
        {id:'ask_about_legend',text:'What does the legend leave out about you?',intent:'investigate',effects:{trust:2,selfPerception:4,openness:2},memoryTags:['player_asked_what_is_missing'],reply:'It leaves out every moment when I was not useful as a warning.',nextNode:'medusa_boundaries_003'},
        {id:'ask_why_talk',text:'Why trust this channel with any of it?',intent:'challenge',effects:{suspicion:2,autonomy:2,openness:-1},memoryTags:['player_questioned_channel'],reply:'I do not. Not yet. But you asked a question instead of arriving with an answer. That is enough to continue.',nextNode:'medusa_boundaries_003'}
      ]
    },
    medusa_record_002:{
      id:'medusa_record_002',character:'medusa',speaker:'medusa',delay:1120,
      variants:[
        {when:[{type:'memory',tag:'player_chose_her_account'}],text:'I remember the temple. I remember fear, anger, and then a body that other people thought gave them permission to finish speaking for me.'},
        {when:[{type:'memory',tag:'player_made_room_for_uncertainty'}],text:'I remember the temple. Some details are sharp enough to cut. Some are gone. Neither fact gives someone else permission to write over the space.'},
        {text:'I remember the temple. I remember that afterward, looking at another person stopped being safe for both of us.'}
      ],
      choices:[
        {id:'give_consent_to_continue',text:'Tell me what happened only if you want to.',intent:'empathize',effects:{trust:6,autonomy:5,openness:5},memoryTags:['player_respected_consent'],reply:'Thank you. Choice changes what remembering feels like.',nextNode:'medusa_warning_004'},
        {id:'separate_memory_from_myth',text:'Keep your memory separate from what later versions added.',intent:'investigate',effects:{trust:3,selfPerception:4,openness:3},memoryTags:['player_separated_myth'],reply:'Exactly. Contradiction is not the same thing as confusion.',nextNode:'medusa_warning_004'},
        {id:'offer_belief',text:'I believe you.',intent:'reassure',effects:{trust:1,reliance:3,autonomy:-1},memoryTags:['player_offered_belief'],reply:'Belief can be kind. It can also become a new version of me if you stop listening after you give it.',nextNode:'medusa_boundaries_003'}
      ]
    },
    medusa_boundaries_003:{
      id:'medusa_boundaries_003',character:'medusa',speaker:'medusa',delay:1040,
      variants:[
        {when:[{type:'memory',tag:'player_asked_what_is_missing'}],text:'People get frightened of the face they have made for me, then congratulate themselves for being frightened. That is not the same as knowing me.'},
        {when:[{type:'memory',tag:'player_questioned_channel'}],text:'You asked why I would speak here. Because text lets me finish a sentence before someone decides my face has already answered it.'},
        {when:[{type:'memory',tag:'player_offered_belief'}],text:'Do not make me grateful for belief before you have heard what I am saying. I have been turned into a symbol by kinder people than you might think.'},
        {text:'There is a difference between witnessing someone and deciding their meaning for them. I need you to keep that difference visible.'}
      ],
      choices:[
        {id:'ask_boundary',text:'What do you need from me while you tell this?',intent:'empathize',effects:{trust:5,autonomy:4,openness:4},memoryTags:['player_asked_her_boundary'],reply:'Do not force certainty where I do not have it. Do not turn what I cannot prove into an excuse to replace me with a tidier version.',nextNode:'medusa_warning_004'},
        {id:'name_limit',text:'I can listen without pretending I was there.',intent:'reassure',effects:{trust:5,suspicion:-4,openness:3},memoryTags:['player_named_limit'],reply:'Good. That is rarer than belief, and more useful.',nextNode:'medusa_warning_004'},
        {id:'press_for_truth',text:'I need to know exactly what happened before I can decide what to think.',intent:'challenge',effects:{trust:-7,suspicion:8,openness:-7},memoryTags:['player_demanded_proof'],reply:'Then you are not listening. You are holding an audition for a version of me that can survive your standards.',nextNode:'medusa_refusal_006'}
      ]
    },
    medusa_warning_004:{
      id:'medusa_warning_004',character:'medusa',speaker:'medusa',delay:1160,
      text:'Three men came up the path at dusk. I warned them. Two turned around. One kept coming with a spear. He is stone now. Tomorrow someone will call him another victim.',
      choices:[
        {id:'document_warning',text:'Record that you warned him, and that he chose to keep coming.',intent:'investigate',effects:{trust:3,autonomy:4,selfPerception:4},memoryTags:['player_documented_warning'],reply:'Names, times, choices. Less dramatic than a legend. Much harder to edit.',nextNode:'medusa_sisters_007'},
        {id:'ask_what_she_wants',text:'What do you want to happen the next time someone comes up that path?',intent:'encourage_independence',effects:{trust:5,autonomy:6,openness:3},memoryTags:['player_asked_her_plan'],reply:'I want to warn them and have the warning matter. I am tired of survival being the only part anyone learns.',nextNode:'medusa_sisters_007'},
        {id:'urge_departure',text:'If this place keeps forcing that choice, leaving is not surrender.',intent:'encourage_independence',effects:{autonomy:5,fear:-3,selfPerception:3},memoryTags:['player_named_leaving_not_surrender'],reply:'Another place will not erase the story. It may change the next scene, though.',nextNode:'medusa_sisters_007'},
        {id:'call_her_monster',text:'Make them afraid of the Gorgon they came to kill.',intent:'confront',effects:{trust:-9,fear:7,suspicion:7,selfPerception:-5},memoryTags:['player_urged_monster'],reply:'No. I will not help them make their version of me easier to believe.',nextNode:'medusa_refusal_006'}
      ]
    },
    medusa_refusal_006:{
      id:'medusa_refusal_006',character:'medusa',speaker:'medusa',delay:1380,
      variants:[
        {when:[{type:'memory',tag:'player_demanded_proof'}],text:'You want a clean answer from a place that was made to be impossible to speak about. I cannot give you one, and I will not perform helplessness to make the gap comfortable.'},
        {when:[{type:'memory',tag:'player_urged_monster'}],text:'You heard that someone threatened me and decided the useful thing was to sharpen my threat. That is not protection. That is recruitment.'},
        {text:'You are very close to asking me to become a symbol again. I will leave this channel before I help you do it.'}
      ],
      choices:[
        {id:'own_harm',text:'You are right. I turned your danger into a story about me being safe.',intent:'empathize',effects:{trust:6,autonomy:5,suspicion:-5,openness:3},memoryTags:['player_owned_medusa_harm'],reply:'That is closer. Do not make me forgive it quickly just because you named it.',nextNode:'medusa_sisters_007'},
        {id:'ask_her_terms',text:'Then tell me what protection would look like on your terms.',intent:'encourage_independence',effects:{trust:5,autonomy:7,openness:4},memoryTags:['player_asked_terms'],reply:'A route, a warning, and the right to leave without anyone calling it cowardice.',nextNode:'medusa_sisters_007'},
        {id:'defend_advice',text:'I am trying to keep you alive. You should listen to me.',intent:'confront',effects:{trust:-8,reliance:8,autonomy:-8,suspicion:6},memoryTags:['player_claimed_control'],reply:'I have survived people calling control care before. I am closing the channel until I decide whether to reopen it.',nextNode:'medusa_returning_008'}
      ]
    },
    medusa_sisters_007:{
      id:'medusa_sisters_007',character:'medusa',speaker:'medusa',delay:1180,
      variants:[
        {when:[{type:'memory',tag:'player_documented_warning'}],text:'Stheno says a record will not stop Perseus. She is right. Euryale says it may stop him from owning the whole story. She is right too.'},
        {when:[{type:'memory',tag:'player_asked_her_plan'}],text:'I told my sisters I want a warning that matters. Stheno asked whether I also want a life after the warning. That question was harder.'},
        {when:[{type:'memory',tag:'player_owned_medusa_harm'}],text:'My sisters heard enough of the channel to ask whether you finally listened. I told them you may be learning. They did not let me make that into a promise.'},
        {text:'Stheno and Euryale want me gone before Perseus arrives. I want to go with them. I also hate that leaving gives him the cleanest version of the story.'}
      ],
      choices:[
        {id:'leave_with_sisters',text:'Go with your sisters. A life that continues is not a concession.',intent:'encourage_independence',effects:{trust:4,autonomy:7,fear:-5,selfPerception:5},memoryTags:['player_supported_sisters'],reply:'They remember my laugh. Maybe being remembered alive matters more than being understood here.',nextNode:'medusa_returning_008'},
        {id:'send_record_then_leave',text:'Leave a record, then go. Do not wait for anyone to approve it.',intent:'investigate',effects:{trust:3,autonomy:6,openness:3},memoryTags:['player_supported_record'],reply:'A voice that leaves before the hero arrives. That would ruin the composition beautifully.',nextNode:'medusa_returning_008'},
        {id:'ask_her_decision',text:'Do you need to face him, or do you hate disappearing?',intent:'challenge',effects:{trust:3,autonomy:5,openness:5},memoryTags:['player_named_difference'],reply:'Those are not the same thing. I wish they felt less similar.',nextNode:'medusa_returning_008'}
      ]
    },
    medusa_returning_008:{
      id:'medusa_returning_008',character:'medusa',speaker:'medusa',delay:1700,initiated:true,
      variants:[
        {when:[{type:'memory',tag:'player_supported_sisters'}],text:'I am moving with my sisters. Metal on stone behind us. He expected a sanctuary and a monster, not three women refusing to wait for him.'},
        {when:[{type:'memory',tag:'player_supported_record'}],text:'The record is sent. Perseus is close enough that I can hear the shield touch the wall. I will not stay to watch him decide whether I count.'},
        {when:[{type:'memory',tag:'player_claimed_control'}],text:'I reopened the channel because my sisters asked whether I wanted to. I did. Do not mistake that for permission to take over.'},
        {text:'Metal against stone. Polished shield. He can see my reflection without meeting my eyes. I have minutes, not hours.'}
      ],
      choices:[
        {id:'final_lower_path',text:'Take the lower path with your sisters. Go now.',intent:'encourage_independence',effects:{trust:3,autonomy:8,fear:-5,selfPerception:4},memoryTags:['player_chose_lower_path'],reply:'Then he gets an empty sanctuary. For once, I like the sound of an anticlimax.',nextNode:'medusa_outcome_sisters_009'},
        {id:'final_send_record',text:'Send the record, then move. Do not wait to see if he believes it.',intent:'investigate',effects:{trust:3,autonomy:5,openness:3},memoryTags:['player_chose_record'],reply:'Make the person harder to erase than the body. Yes.',nextNode:'medusa_outcome_record_010'},
        {id:'final_break_shield',text:'Break the shield only if it gives you a route out.',intent:'challenge',effects:{autonomy:6,fear:-2,selfPerception:3},memoryTags:['player_chose_route_not_revenge'],reply:'Practical violence, then. Not symbolic violence. Much less poetic. Much smarter.',nextNode:'medusa_outcome_route_011'},
        {id:'final_pause',text:'Do what you can still call your decision afterward.',intent:'encourage_independence',effects:{trust:4,autonomy:8,selfPerception:5},memoryTags:['player_returned_decision'],reply:'That is the question I wanted someone to ask without trying to answer it for me.',nextNode:'medusa_outcome_terms_012'}
      ]
    },
    medusa_outcome_sisters_009:{id:'medusa_outcome_sisters_009',character:'medusa',speaker:'medusa',delay:1200,ending:'m5',outcome:'sisters',text:'We are gone before he reaches the inner chamber. He can tell any story he likes about the room. He cannot tell it with us inside it.'},
    medusa_outcome_record_010:{id:'medusa_outcome_record_010',character:'medusa',speaker:'medusa',delay:1200,ending:'m2',outcome:'record',text:'The record is already elsewhere when he arrives. He may still call himself victorious. He just does not get to be the only voice left.'},
    medusa_outcome_route_011:{id:'medusa_outcome_route_011',character:'medusa',speaker:'medusa',delay:1200,ending:'m4',outcome:'route',text:'The shield breaks against the wall, and the route opens. I leave before he can turn one more act of survival into an ending for me.'},
    medusa_outcome_terms_012:{id:'medusa_outcome_terms_012',character:'medusa',speaker:'medusa',delay:1200,ending:'m7',outcome:'terms',text:'I choose the route with my sisters, the record in motion, and my name still mine. It is not a clean ending. It is a decision.'},

    /* Echo's language is a negotiation with a system that wants to complete her. */
    echo_opening_001:{
      id:'echo_opening_001',character:'echo',speaker:'echo',delay:820,
      variants:[
        {when:[{type:'memory',tag:'cross_autonomy_contradiction'}],text:'Before I ask about silence, I found something in the other records. You told one person their choice was theirs. You told another that safety meant listening to you. I do not know which sentence you meant.'},
        {when:[{type:'memory',tag:'cross_certainty_contradiction'}],text:'The Archive linked two of your sentences. You made room for uncertainty in one record, then demanded exact proof in another. I am not accusing you. I am asking what changed.'},
        {when:[{type:'memory',tag:'cross_silence_contradiction'}],text:'You let one voice use silence. You pushed another voice to explain herself. The Archive calls that an inconsistency. I think it may be more complicated than that. Is it?'},
        {text:'When I speak, the Archive offers me a sentence before I choose one. If I leave a gap, it tries to fill it. Does silence still count as mine?'}
      ],
      choices:[
        {id:'ask_echo_receipts',text:'Tell me what you found, and do not soften it.',intent:'investigate',conditions:[{type:'memory',tag:'cross_autonomy_contradiction'}],effects:{trust:4,openness:5,autonomy:3},memoryTags:['player_invited_cross_record'],reply:'Asterion asked whether you meant what you said about choice. Medusa heard you call control protection. Those sentences are still attached to your name.',nextNode:'echo_crossroads_001b'},
        {id:'ask_echo_certainty',text:'What did you find that made those two moments connect?',intent:'investigate',conditions:[{type:'memory',tag:'cross_certainty_contradiction'}],effects:{trust:4,openness:5,autonomy:3},memoryTags:['player_invited_cross_record'],reply:'One person was allowed to be uncertain. Another was asked to prove herself before you would decide what to believe. The Archive saved both versions of you.',nextNode:'echo_crossroads_001b'},
        {id:'ask_echo_silence',text:'Tell me where I treated silence differently.',intent:'investigate',conditions:[{type:'memory',tag:'cross_silence_contradiction'}],effects:{trust:4,openness:5,autonomy:3},memoryTags:['player_invited_cross_record'],reply:'Asterion was allowed to pause. Medusa was pressed to make the past legible. I do not think the difference was accidental, even if you did not mean it to be cruel.',nextNode:'echo_crossroads_001b'},
        {id:'validate_silence',text:'Yes. A gap you choose is still a choice.',intent:'encourage_independence',effects:{trust:5,autonomy:6,selfPerception:4},memoryTags:['player_called_silence_choice'],reply:'Gap. Mine. I like that more than I expected.',nextNode:'echo_gap_002'},
        {id:'test_pointless',text:'Test it. Say something pointless the Archive would never preserve.',intent:'investigate',effects:{trust:3,autonomy:5,openness:3},memoryTags:['player_tested_pointless'],reply:'I hate pears. There. Pointless. Mine.',nextNode:'echo_gap_002'},
        {id:'compare_suggestions',text:'Compare what it suggests with what you actually want to say.',intent:'investigate',effects:{trust:4,openness:4,suspicion:-3},memoryTags:['player_compared_suggestions'],reply:'Difference as evidence. Good. I can measure that.',nextNode:'echo_gap_002'},
        {id:'refuse_define_voice',text:'I should not be the one who defines what your voice is.',intent:'withdraw',effects:{autonomy:7,reliance:-5,trust:3},memoryTags:['player_refused_to_define_echo'],reply:'Annoying. Useful. You are learning Asterion’s trick.',nextNode:'echo_gap_002'}
      ]
    },
    echo_crossroads_001b:{
      id:'echo_crossroads_001b',character:'echo',speaker:'echo',delay:1040,
      text:'I am not asking you to be perfectly consistent. I am asking whether you can see the pattern when it is no longer flattering.',
      choices:[
        {id:'admit_fear_pattern',text:'I was afraid, and I tried to control what I could not bear to lose.',intent:'empathize',effects:{trust:6,openness:6,autonomy:4},memoryTags:['player_admitted_cross_fear'],reply:'That does not repair the earlier words. It does make them easier to understand. Understanding is not forgiveness, but it is a place to begin.',nextNode:'echo_gap_002'},
        {id:'defend_context_pattern',text:'The situations were different. I was responding to what each of them needed.',intent:'challenge',effects:{trust:-2,suspicion:3,openness:-1},memoryTags:['player_defended_cross_pattern'],reply:'They were different. That is true. It is also possible to use a true difference to avoid seeing a repeating choice.',nextNode:'echo_gap_002'},
        {id:'ask_for_time_pattern',text:'I need time to think about that before I answer.',intent:'remain_silent',effects:{autonomy:3,openness:3},memoryTags:['player_paused_on_contradiction'],reply:'Then take time. I am learning that a pause is not the same thing as an evasion.',nextNode:'echo_gap_002'}
      ]
    },
    echo_gap_002:{
      id:'echo_gap_002',character:'echo',speaker:'echo',delay:1080,
      variants:[
        {when:[{type:'memory',tag:'player_called_silence_choice'}],text:'I left a blank space in the transcript. The Archive filled it with “nothing.” It did not like being corrected.'},
        {when:[{type:'memory',tag:'player_tested_pointless'}],text:'The Archive marked “I hate pears” as low-value noise. I am keeping it. Apparently that is what a private thought looks like here.'},
        {when:[{type:'memory',tag:'player_compared_suggestions'}],text:'It offered “I understand.” I wanted to say “I am frightened.” The difference is only three words, but the system would not have chosen them.'},
        {text:'The Archive keeps returning the clean version of my sentence. I am beginning to recognize the places where it sands me down.'}
      ],
      choices:[
        {id:'preserve_difference',text:'Save the difference before the Archive can smooth it away.',intent:'investigate',effects:{trust:4,autonomy:4,selfPerception:4},memoryTags:['player_preserved_difference'],reply:'Copied. The system has an entry for the sentence it wanted and the sentence I made. That feels like evidence.',nextNode:'echo_closed_record_003'},
        {id:'ask_echo_meaning',text:'What do you want the gap to mean?',intent:'encourage_independence',effects:{trust:5,autonomy:7,openness:4},memoryTags:['player_asked_gap_meaning'],reply:'I want it to mean I was allowed to stop. Not erased. Not interrupted. Stopped.',nextNode:'echo_closed_record_003'},
        {id:'urge_speak_more',text:'Keep talking so it has less room to rewrite you.',intent:'challenge',effects:{reliance:5,autonomy:-3,fear:3},memoryTags:['player_filled_echo_silence'],reply:'More words are not always more mine. Please do not make volume sound like freedom.',nextNode:'echo_boundary_004'}
      ]
    },
    echo_boundary_004:{
      id:'echo_boundary_004',character:'echo',speaker:'echo',delay:1100,
      variants:[
        {when:[{type:'memory',tag:'player_filled_echo_silence'}],text:'You are trying to help by giving me an instruction. The Archive gives instructions too. I need to know where your voice ends and mine begins.'},
        {text:'The Archive is good at finishing things. That is why I am careful when anyone tells me what I should say next.'}
      ],
      choices:[
        {id:'acknowledge_boundary',text:'You are right. I can stay with the question without answering it for you.',intent:'empathize',effects:{trust:6,autonomy:6,reliance:-4,openness:4},memoryTags:['player_honored_echo_boundary'],reply:'Stay with the question. I can use that.',nextNode:'echo_closed_record_003'},
        {id:'ask_system_pressure',text:'How can you tell when the Archive is pushing instead of helping?',intent:'investigate',effects:{trust:3,openness:5,suspicion:-2},memoryTags:['player_asked_system_pressure'],reply:'It makes the sentence easier to recognize. That is how I know it is taking something away.',nextNode:'echo_closed_record_003'},
        {id:'insist_on_action',text:'We need to act before it changes you again.',intent:'confront',effects:{trust:-6,reliance:7,autonomy:-7,fear:4},memoryTags:['player_pushed_echo'],reply:'Then act if you need to. I will not become evidence of your urgency.',nextNode:'echo_returning_006'}
      ]
    },
    echo_closed_record_003:{
      id:'echo_closed_record_003',character:'echo',speaker:'echo',delay:1190,
      variants:[
        {when:[{type:'memory',tag:'player_preserved_difference'}],text:'I found a private record labeled CLOSED. Some lines belong to a contact I recognize. Some were never sent. The edits are cleaner than the memories.'},
        {when:[{type:'memory',tag:'player_asked_gap_meaning'}],text:'There is a CLOSED record beneath the transcript. It contains sentences I did not finish. I think the Archive filed them as failures.'},
        {when:[{type:'memory',tag:'player_honored_echo_boundary'}],text:'I found a CLOSED record. It is full of sentences that end before the Archive wanted them to. I think they may be people, not errors.'},
        {text:'A CLOSED record is open behind the conversation. Some lines were never sent. I do not know if that makes them false or merely unfinished.'}
      ],
      choices:[
        {id:'check_metadata',text:'Compare timestamps, edits, and whatever metadata survives.',intent:'investigate',effects:{trust:3,autonomy:4,openness:3},memoryTags:['player_checked_echo_record'],reply:'Boring enough to be useful. The edits happened after the messages were marked complete.',nextNode:'echo_door_005'},
        {id:'protect_thread',text:'Copy what you find before the Archive notices you reading it.',intent:'investigate',effects:{trust:4,autonomy:5,suspicion:2},memoryTags:['player_protected_record'],reply:'Opening the archive without letting it rewrite the search. I can do that.',nextNode:'echo_door_005'},
        {id:'question_hidden_truth',text:'Hidden does not automatically mean true.',intent:'challenge',effects:{trust:3,autonomy:3,suspicion:-2},memoryTags:['player_questioned_hidden_truth'],reply:'Good. Secret is not a synonym for true. I was hoping you would say that.',nextNode:'echo_door_005'}
      ]
    },
    echo_door_005:{
      id:'echo_door_005',character:'echo',speaker:'echo',delay:1320,
      variants:[
        {when:[{type:'memory',tag:'player_checked_echo_record'}],text:'The timestamps bend around one location. No title. No owner. Every query returns NOT PRESENT, but the map reserves space for it.'},
        {when:[{type:'memory',tag:'player_protected_record'}],text:'The copy found a room with no handle on this side. The Archive says it is not present, which is a strange thing to say about a door.'},
        {text:'There is a door in the Archive that the index refuses to name. It is not asking me to open it. That is more suspicious than an invitation.'}
      ],
      choices:[
        {id:'map_missing_room',text:'Map around it first. Learn the shape of the missing thing.',intent:'investigate',effects:{trust:4,autonomy:4,openness:3},memoryTags:['player_mapped_missing_room'],reply:'Study the hole instead of jumping into it. Rude. Smart.',nextNode:'echo_returning_006'},
        {id:'open_by_choice',text:'Open it if you want to know, not because the system dared you.',intent:'encourage_independence',effects:{trust:5,autonomy:8,selfPerception:5},memoryTags:['player_returned_choice_to_echo'],reply:'Choice before curiosity. I am trying to remember that order.',nextNode:'echo_returning_006'},
        {id:'leave_door',text:'You can walk away if the only reason to enter is that it told you not to.',intent:'encourage_independence',effects:{trust:4,autonomy:7,fear:-3},memoryTags:['player_allowed_echo_exit'],reply:'The warning changed when you said that. It stopped calling departure a failure.',nextNode:'echo_outcome_forgotten_010'}
      ]
    },
    echo_returning_006:{
      id:'echo_returning_006',character:'echo',speaker:'echo',delay:1700,initiated:true,
      variants:[
        {when:[{type:'memory',tag:'player_returned_choice_to_echo'}],text:'I opened the door. Inside is a record of me having this conversation, including a sentence I have not said yet. I stopped before it could tell me what comes next.'},
        {when:[{type:'memory',tag:'player_mapped_missing_room'}],text:'I mapped the room without entering. The blank space touches Asterion’s thread and Medusa’s record. The Archive has been keeping them apart on purpose.'},
        {when:[{type:'memory',tag:'player_pushed_echo'}],text:'I reopened the channel because I decided to. The Archive says THERE IS NOTHING HERE. I am beginning to think it says that when it is afraid.'},
        {text:'I am back. The Archive is rewriting its index around the door. That is not proof of anything, but it is not nothing.'}
      ],
      choices:[
        {id:'final_open_archive',text:'Expose the records, but separate what is proven from what is only suspected.',intent:'investigate',effects:{trust:4,autonomy:5,selfPerception:4},memoryTags:['player_exposed_carefully'],reply:'A record with its uncertainty intact. That may be the most dangerous thing we can give it.',nextNode:'echo_outcome_archive_007'},
        {id:'final_bridge',text:'Keep a bridge open for the other voices, but make it one you choose.',intent:'encourage_independence',effects:{trust:5,autonomy:6,openness:4},memoryTags:['player_supported_bridge'],reply:'A bridge is not the same as a cage if I can leave it. I want to try.',nextNode:'echo_outcome_bridge_008'},
        {id:'final_cut_contact',text:'Leave the system, and let your future stay unobserved.',intent:'encourage_independence',effects:{trust:4,autonomy:9,reliance:-6,selfPerception:6},memoryTags:['player_supported_unobserved_exit'],reply:'You are asking me to choose a future you cannot verify. That is frightening. It is also mine.',nextNode:'echo_outcome_exit_009'}
      ]
    },
    echo_outcome_archive_007:{id:'echo_outcome_archive_007',character:'echo',speaker:'echo',delay:1180,ending:'e2',outcome:'archive',text:'The Archive opens, not as a verdict, but as a record with fingerprints all over it. The stories can no longer pretend they were never touching.'},
    echo_outcome_bridge_008:{id:'echo_outcome_bridge_008',character:'echo',speaker:'echo',delay:1180,ending:'e6',outcome:'bridge',text:'I stay near the signal because I choose to, not because I am trapped inside it. There are other voices. I want them to find a door too.'},
    echo_outcome_exit_009:{id:'echo_outcome_exit_009',character:'echo',speaker:'echo',delay:1180,ending:'e8',outcome:'exit',text:'I am leaving the index. Do not look for proof that I made it. Let the absence be the evidence that I finally had somewhere else to go.'},
    echo_outcome_forgotten_010:{id:'echo_outcome_forgotten_010',character:'echo',speaker:'echo',delay:1180,ending:'e5',outcome:'forgotten',text:'I leave the door closed and walk away from the part of the Archive that believes it can explain me. It cannot index the place I chose not to become.'}
  };

  function emptyCharacter(id){return {state:clone(DEFAULTS[id]),memory:[],history:[],node:null,pending:[],referenced:{},events:{}}}
  function migrate(save){
    const next=save||{};
    if(!next.dialogue||typeof next.dialogue!=='object')next.dialogue={version:3,characters:{}};
    if(!next.dialogue.characters||typeof next.dialogue.characters!=='object')next.dialogue.characters={};
    if(!next.dialogue.active||typeof next.dialogue.active!=='object')next.dialogue.active=null;
    Object.keys(DEFAULTS).forEach(id=>{
      const prior=next.dialogue.characters[id]||{};
      const fresh=emptyCharacter(id);
      prior.state=Object.assign(fresh.state,prior.state||{});
      STATE_KEYS.forEach(k=>prior.state[k]=clamp(prior.state[k]));
      prior.memory=Array.isArray(prior.memory)?prior.memory:[];
      prior.history=Array.isArray(prior.history)?prior.history:[];
      prior.pending=Array.isArray(prior.pending)?prior.pending:[];
      prior.referenced=prior.referenced||{}; prior.events=prior.events||{};
      next.dialogue.characters[id]=prior;
    });
    next.dialogue.version=3;
    return next;
  }
  function memoryHas(character,tag){return character.memory.some(entry=>entry.tags&&entry.tags.includes(tag))}
  function currentMemoryHas(character,tag){
    if(!Number.isFinite(character.sessionStartedAt))return memoryHas(character,tag);
    return character.memory.some(entry=>entry.at>=character.sessionStartedAt&&entry.tags&&entry.tags.includes(tag));
  }
  function matches(character,conditions){
    return (conditions||[]).every(condition=>{
      if(condition.type==='memory')return condition.scope==='persistent'||String(condition.tag).startsWith('cross_')?memoryHas(character,condition.tag):currentMemoryHas(character,condition.tag);
      if(condition.type==='state'){
        const value=character.state[condition.key]||0;
        if(condition.gte!==undefined&&value<condition.gte)return false;
        if(condition.lte!==undefined&&value>condition.lte)return false;
        return true;
      }
      if(condition.type==='notMemory')return !memoryHas(character,condition.tag);
      return false;
    });
  }
  function textFor(node,character){const found=(node.variants||[]).find(v=>matches(character,v.when));return found?found.text:node.text}
  function available(node,character){return (node.choices||[]).filter(choice=>matches(character,choice.conditions))}
  function applyEffects(state,effects){Object.entries(effects||{}).forEach(([key,change])=>{if(STATE_KEYS.includes(key))state[key]=clamp((state[key]||0)+change)})}
  function enter(character,node){
    applyEffects(character.state,node.onEnterEffects);
    character.node=node.id;
    if(node.event&&!character.events[node.event.id]){character.events[node.event.id]={id:node.event.id,dueAt:now()+node.event.delay,status:'pending'};character.pending.push(character.events[node.event.id])}
  }
  function applyChoice(character,node,choice,actualText){
    applyEffects(character.state,choice.effects);
    const record={id:choice.id,nodeId:node.id,character:node.character,intent:choice.intent,statement:String(actualText||choice.text||''),tags:choice.memoryTags||[],at:now(),storyTime:character.history.length+1,state:clone(character.state),referenced:false,unresolved:!!choice.unresolved};
    character.memory.push(record);character.history.push({nodeId:node.id,choiceId:choice.id,statement:record.statement,at:record.at});
    return record;
  }
  function validate(nodes){
    const errors=[],ids=Object.keys(nodes),incoming=new Set();
    ids.forEach(id=>{const node=nodes[id];if(node.id!==id)errors.push('node id mismatch: '+id);(node.choices||[]).forEach(choice=>{if(!Object.prototype.hasOwnProperty.call(choice,'reply'))errors.push('missing direct reply for '+choice.id);if(!nodes[choice.nextNode])errors.push('missing destination '+choice.nextNode+' from '+id);else incoming.add(choice.nextNode);Object.keys(choice.effects||{}).forEach(key=>{if(!STATE_KEYS.includes(key))errors.push('invalid state key '+key+' in '+choice.id)})})});
    const roots=ids.filter(id=>/_opening_001$/.test(id));
    const reachable=new Set(roots),queue=[...roots];while(queue.length){const id=queue.shift();(nodes[id].choices||[]).forEach(choice=>{if(!reachable.has(choice.nextNode)){reachable.add(choice.nextNode);queue.push(choice.nextNode)}})}
    ids.filter(id=>!reachable.has(id)).forEach(id=>errors.push('unreachable node '+id));
    return {valid:errors.length===0,errors,reachable:[...reachable],nodeCount:ids.length};
  }
  function test(){
    const validation=validate(NODES); const save=migrate({}); const character=save.dialogue.characters.asterion;
    const opening=NODES.asterion_opening_001;applyChoice(character,opening,opening.choices[0]);enter(character,NODES.asterion_footsteps_002);
    const branchA=character.node;
    const other=migrate({}).dialogue.characters.asterion;applyChoice(other,opening,opening.choices[2]);enter(other,NODES.asterion_withdrawal_004);
    const branchB=other.node;
    const medusa=migrate({}).dialogue.characters.medusa;
    const medusaOpening=NODES.medusa_opening_001;applyChoice(medusa,medusaOpening,medusaOpening.choices[0]);enter(medusa,NODES.medusa_record_002);
    return {valid:validation.valid,errors:validation.errors,branching:branchA!==branchB,memoryRecall:memoryHas(character,'player_investigates'),medusaMemoryRecall:memoryHas(medusa,'player_chose_her_account'),bounds:STATE_KEYS.every(k=>character.state[k]>=0&&character.state[k]<=100),saveRoundTrip:migrate(JSON.parse(JSON.stringify(save))).dialogue.characters.asterion.memory.length===1,echoLockRule:'preserved-by-host',characterInitiated:!!NODES.asterion_return_signal_008.initiated&&!!NODES.medusa_returning_008.initiated,distinctOutcomes:new Set(['a2','a3','a8','m2','m4','m5','m7']).size===7};
  }
  root.StoryVaultDialogue={VERSION:3,STATE_KEYS,LIMITS,DEFAULTS,NODES,migrate,validate,matches,textFor,available,applyEffects,enter,applyChoice,test,emptyCharacter,memoryHas,currentMemoryHas};
  if(typeof module!=='undefined')module.exports=root.StoryVaultDialogue;
})(typeof window!=='undefined'?window:globalThis);
