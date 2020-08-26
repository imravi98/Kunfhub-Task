const express= require('express');
const app=express();
const request = require('request');

const port = process.env.PORT || 3000;

function IsSimilarEventName(t,s) {
  // var t = "React Conference 2019"
  // var s = "ReactConf '19"
  s=s.replace(/'|[^a-zA-Z]/g,'')
  t=t.replace(/'|[^a-zA-Z]/g,'')
  
  if (s.length > t.length) return false;
        var i = 0, j = 0;
        var n1 = s.length, n2 = t.length;
        while ((i < n1) && (j < n2)) {
            if (s[i] === t[j]) {
                i+=1;
                j+=1;
            } else {
                j+=1;
            }
        }
  var n = i === n1;
  return n
}

 function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

function toRad(Value) 
{
    return Value * Math.PI / 180;
}


function parse(data) {
	  console.log("Parsing JSON");
	  html= "<head><title>Konfhub</title></head><table border='2' >";
	  var cols = ["city","confName","ConfStartDate","ConfUrl","State","Country","entryType","venue"]		  
	  
	  html += "<ul style='background-color:#dee6c8;color:#333b23;line-height:1.8em font-size:20px;'>";
	  UI_raw=data["paid"].concat(data["free"])
	  UI_raw = UI_raw.sort(function(a,b){var x=(new Date(a.confStartDate))>(new Date(b.confStartDate))?1:-1; return x})
	  UI=[]

	  for (let i = 0; i< UI_raw.length - 1; i++) 
	   {
	      UI.push(UI_raw[i])

	      if(((new Date(UI_raw[i+1]["confStartDate"])).getTime()===(new Date(UI_raw[i]["confStartDate"]).getTime())))
	      {
	      	var string_i = UI_raw[i]["confName"]
	      	var string_i_plus_1 = UI_raw[i+1]["confName"]
	      	var condition1=null
	      	var condition2=null
	      	if(string_i.length>=string_i_plus_1.length)
	      		condition1 = IsSimilarEventName(string_i,string_i_plus_1)
	      	else
	      		condition1 = IsSimilarEventName(string_i_plus_1,string_i)
	      	
	      	condition2 = (calcCrow(UI_raw[i]["lat"],UI_raw[i]["long"],UI_raw[i+1]["lat"],UI_raw[i+1]["long"])<=10)


	      	if((condition2)&&(condition1)) 
			      {
			          console.log("Duplicate Event Found--->\n"+UI_raw[i].confName+"\n"+UI_raw[i].confStartDate+"\n"+UI_raw[i].venue+"\n"+UI_raw[i].confUrl+"\n")
				      i+=1;
			      }
	      }      
	   }



	  UI.forEach(function(element) {
	  		
		html+="<li style='padding:10px 15px ;font-size:18px;'>"+"Conference on: <b>"+element["confStartDate"]+"</b> at ";

		if(element["state"])
			html+=element["state"]+","

		html+=element["country"]
		
		if(element["entryType"]=="Paid")
			html+="<nav style='color:#0c6319; margin:10px; font-size:18px;'> <b>Tickets:"+element["entryType"]+"</b></nav>";
		else
			html+="<nav style='color:#bf674e;margin:10px; font-size:18px;'> <b>Tickets:"+element["entryType"]+"</b></nav>";			

		html+="<ul>"+"<li style='padding:10px 15px'><b style='color:#0e294f;background-color:#addbe0;padding:2px'>"+element["confName"]+"</b></li>";
		html+="<li style='padding:10px 15px'>Duration : <b>"+((new Date(element["confEndDate"]))-(new Date(element["confStartDate"])))/(1000*24*60*60)+" days</b></li>";
		html+="<li style='padding:10px 15px'>Venue : <b>"+element["venue"]+"</b></li>";
		html+="<a href='"+element["confUrl"]+"'><button style='background-color:#ff7f50;color:#fff;padding:10px 15px;cursor:pointer;margin:10px; font-size:16px; border-radius:10px;'> Conference URL"+"</button></a>";
		html+="<a href='"+element["confRegUrl"]+"'><button style='background-color: #ff7f50;color:#ffffff;padding:10px 15px;cursor:pointer;margin:10px; font-size:16px; border-radius:10px;'> Registration URL"+"</button></a>";
		html+="</ul>"+"</li>"
		html+="<br>"
	  })

	  html += "</ul>";

	  return html;
}


app.get("/request",(req,res)=>{
	 
		request('https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences', function (err, response, body) {
		  if(err)
		  {
			  res.json("Most probably network issue.");
			  console.log(err);
		  }
		  else
		  {
			  if(response.statusCode==200)
			  {
				 res.write(parse(JSON.parse(body)));
                 res.end(); 
			  }
			  
		  }
	 });
})

app.get('*',(req,res)=>{
  res.redirect("/request");
})

app.listen(port, () => console.log(`Listening on port ${port}`));