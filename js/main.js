////////////////////////////////////////////////////////////////////////////////////
// Global

var JSON_DATA_TEAM = {};

var MATCH_INDEX = 1;
var GAME_INDEX = [ 1 ];

////////////////////////////////////////////////////////////////////////////////////
// Error Message
var ERROR_ID_TEAM_GET_ERROR 		= "チーム情報が取得出来ませんでした";

/////////////////////////////////////////////////
//

function errorDlg(msg)
{
	window.alert("エラー:" + msg);
}

////////////////////////////////////////////////////////////////////////////////////
//
$.ajax(
{
	url: './json/team.json',
	type: 'GET',
	dataType: 'json',
	data: {},
	
	success: function (json)
	{
		JSON_DATA_TEAM = json;
		InitMatch();
	},
	error: function (XMLHttpRequest, textStatus, errorThrown)
	{
		errorDlg(ERROR_ID_TEAM_GET_ERROR);
	}
});

////////////////////////////////////////////////////////////////////////////////////
function CreateTeamVODs()
{
	// Team
	SetTeamForm($('#region_form').val(), MATCH_INDEX);
	// VODs
	CreateVODs(MATCH_INDEX, GAME_INDEX[MATCH_INDEX-1]);
}

function InitMatch()
{
	// Region
	SetRegionForm();
	
	CreateTeamVODs();
	
	$(function()
	{
		/////////////////////////////
		// Region
		/////////////////////////////
		$("select#region_form").change(function()
		{
			for( var i = 1 ; i <= MATCH_INDEX ; ++i )
			{
				SetTeamForm($('#region_form').val(), i);
			}
		});
	});
}

function SetRegionForm()
{
	var target = document.getElementById("region");
	var newTag;
	
	newTag = document.createElement("span");
	
	var tag = new Array();
	
	tag.push("<select id='region_form'>");
	
	for( var key in JSON_DATA_TEAM )
	{
		tag.push("<option value='" + key + "' >" + key + "</option>");
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

function SetTeamForm(region, index)
{
	var target = document.getElementById("vods");
	var newTag;
	
	if( document.getElementById("match_" + index) == null )
	{
		newTag = document.createElement("match" + index);
		newTag.id ="match_" + index;
		
		target.appendChild(newTag);
	}
	
	target = document.getElementById("match_" + index);
	
	if( document.getElementById("match_"+ index + "_team") == null )
	{
		newTag = document.createElement("match_" + index + "_team");
		newTag.id ="match_"+ index + "_team";
		
		target.appendChild(newTag);
	}
	
	$("match_"+ index + "_team").children().remove();
	
	target = document.getElementById("match_"+ index + "_team");
	newTag = document.createElement("pre");
	newTag.id = "match_"+ index + "_team_from";
	newTag.className ="team";
	
	var tag = new Array();
	
	tag.push("Match " + index + "<br />");

	// Blue
	tag.push("Blue Team : ");
	tag.push("<select id='match_"+ index + "_blue_team_form'>");
	
	for( var key in JSON_DATA_TEAM[region] )
	{
		tag.push("<option value='" + JSON_DATA_TEAM[region][key].code + "' >" + key + "</option>");
	}
	
	tag.push("</select>");
	tag.push("    ");
	
	// Red
	tag.push("Red Team : ");
	tag.push("<select id='match_"+ index + "_red_team_form'>");
	
	for( var key in JSON_DATA_TEAM[region] )
	{
		tag.push("<option value='" + JSON_DATA_TEAM[region][key].code + "' >" + key + "</option>");
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

function CreateVODs(match_no, game_no)
{
	var target = document.getElementById("match_" + match_no);
	var newTag;
	
	newTag = document.createElement("game_" + game_no);
	
	newTag.innerHTML = "<b><u>Game " + game_no + "</u></b><br />" +
			"P&B Start : " + "<input id='" + "match_" + match_no + "_game_" + game_no + "_pb_url' />" + "<br />" +
			"Game Start : " + "<input id='" + "match_" + match_no + "_game_" + game_no  + "_game_url' />" + "<br />" +
			"Highlights : " + "<input id='" + "match_" + match_no + "_game_" + game_no  + "highlights_url' />" + "<br />" +
			"<br />";
	
	target.appendChild(newTag);
}

function CreateMatch()
{
	MATCH_INDEX = MATCH_INDEX + 1;
	GAME_INDEX[MATCH_INDEX - 1] = 1;
	
	CreateTeamVODs();
}

function CreateGame()
{
	GAME_INDEX[MATCH_INDEX - 1]++;
	
	CreateVODs(MATCH_INDEX, GAME_INDEX[MATCH_INDEX - 1]);
}

function GetWikisCode()
{
	var target = document.getElementById("code");
	var newTag;
	
	$("#code").children().remove();
	
	newTag = document.createElement("pre");
	
	var tag = new Array();
	
	tag.push('{|class="wikitable"' + "<br />");
	tag.push("! width=250px |'''Blue Team'''" + "<br />");
	tag.push("! width=225px |'''Red Team'''" + "<br />");
	tag.push("! width=70px |'''P&B Start'''" + "<br />");
	tag.push("! width=70px |'''Game Start'''" + "<br />");
	tag.push("! width=70px |'''Highlights'''" + "<br />");
	
	var team = [];
	var pb_url = "";
	var game_url = "";
	var highlights_url = "";
	
	for( var i = 0 ; i < MATCH_INDEX ; ++i )
	{
		team = [ $("#match_" + (i + 1) + "_blue_team_form").val(), $("#match_" + (i + 1) + "_red_team_form").val() ];
		
		for( var j = 0 ; j < GAME_INDEX[i] ; ++j )
		{
			if( i == 0 || j != 0 )
				tag.push("|-" + "<br />");
			
			pb_url = $("#match_" + (i + 1) + "_game_" + (j + 1) + "_pb_url").val();
			game_url = $("#match_" + (i + 1) + "_game_" + (j + 1) + "_game_url").val();
			highlights_url = $("#match_" + (i + 1) + "_game_" + (j + 1) + "highlights_url").val();
			
			tag.push("|{{team|"+ team[0] + "|size=35px}}" + "<br />");
			tag.push("|{{team|"+ team[1] + "|size=35px}}" + "<br />");
			tag.push("|["+ pb_url + " P+B]" + "<br />");
			tag.push("|["+ game_url + " Game]" + "<br />");
			tag.push("|["+ highlights_url + " Highlights]" + "<br />");
			
			team.unshift( team[1] );
			team.pop();

		}
		tag.push('|-style="border-top:3px solid #aaa;"' + "<br />");
	}
	
	tag.push("|}" + "<br />");
	tag.push("{{TD|tab}}" + "<br />");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}