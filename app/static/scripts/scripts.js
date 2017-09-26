var mouse = 1;
var post_content = {};
var blocks_data=[];
var links_data=[];
var temp_links = [];
var extra_size = 1.5;
var insert_mode_flag = true;

var save_content = function(){
	post_content.blocks_data = blocks_data;
	post_content.links_data=links_data;
	$.ajax({
		type:'POST',
		url:'/api/'+post_content.id+'/',
		data:JSON.stringify(post_content),
		success:function(){console.log('great')},
		contentType : 'application/json'

	})
}

var create_svg = function(){
	var svgContainer = d3.select('#chart').append('svg').attr("width", window.innerWidth).attr("height", window.innerHeight);
}

//get svg container
var get_svg = function(){
	return d3.select('svg');
}

//create a new block
var add_block = function(x,y){
	var content = 'Enter Content';
	blocks_data.push({'x':x,'y':y,'text':content});
	update_blocks();
}



var update_blocks = function(){


	//get blocks
	var blocks = svg.selectAll('.blocks').data(blocks_data);

	//add new blocks
	blocks_new = blocks.enter().append('g').attr('class','blocks');
	//create an html layer for html elements
	var html_layer = blocks_new.append('foreignObject').attr('width',1).attr('height',function(d){ return calculate_text_size(d.text).height*extra_size}).attr('x',function(d){return d.x;}).attr('y',function(d){return d.y;});
	var dragger = html_layer.append('xhtml:div').attr('class','dragger').call(d3.drag().on('drag',move_block));
	var texts = html_layer.append('xhtml:input').attr('type','text').attr('value',function(d){ return d.text;}).attr('style',function(d){ return 'height:'+calculate_text_size(d.text).height*extra_size+'px; width:'+calculate_text_size(d.text).width*extra_size+'px;'}).on('keyup',function(){adjust_input_width(html_layer)}).on('dblclick',remove_current_block).call(d3.drag().on('start',drag_link_start).on('drag',drag_link).on('end',add_link));

	//update existing blocks
	//update x y
	html_layer = blocks.select('foreignObject').attr('width',1).attr('height',function(d){ return calculate_text_size(d.text).height*extra_size}).attr('x',function(d){return d.x;}).attr('y',function(d){return d.y;})
		//update input
		texts = blocks.select('input').attr('value',function(d){ return d.text;}).attr('style',function(d){ return 'height:'+calculate_text_size(d.text).height*extra_size+'px; width:'+calculate_text_size(d.text).width*extra_size+'px;'})

		//remove blocks
		blocks.exit().remove();

	//need to remove unlinked links

	update_links();

}



var remove_current_block = function(){

	var dom = d3.event.currentTarget.__data__;
	var index = blocks_data.indexOf(dom);
	blocks_data.splice(index,1);
	update_blocks();
}

var remove_current_link = function(){

	var dom = d3.event.currentTarget.__data__;
	var index = links_data.indexOf(dom);
	links_data.splice(index,1);
	update_links();
}

var update_links = function(){

	var stroke_width = 3;
	//get links
	var links = svg.selectAll('.links').data(links_data);

	//add new links
	var links_new = links.enter().append('line').attr('class','links').style('stroke','black').style('stroke-width',stroke_width).attr('x1',function(d){return get_block_center(d.parent).x;}).attr('y1',function(d){return get_block_center(d.parent).y;}).attr('x2',function(d){return get_block_center(d.child).x;}).attr('y2',function(d){return get_block_center(d.child).y;}).on('dblclick',remove_current_link);

	//update existing links
	//update parent child
	links.attr('x1',function(d){return get_block_center(d.parent).x;}).attr('y1',function(d){return get_block_center(d.parent).y;}).attr('x2',function(d){return get_block_center(d.child).x;}).attr('y2',function(d){return get_block_center(d.child).y;});

	//remove links
	links.exit().remove();
}

var update_temp_links = function(){
	var stroke_width = 3;
	//get links
	var links = svg.selectAll('.temp-links').data(temp_links);

	//add new links
	var links_new = links.enter().append('line').attr('class','temp-links').style('stroke','black').style('stroke-width',stroke_width).attr('x1',function(d){return d.parent.x;}).attr('y1',function(d){return d.parent.y;}).attr('x2',function(d){return d.child.x}).attr('y2',function(d){return d.child.y});

	//update existing links
	//update parent child
	links.attr('x1',function(d){return d.parent.x;}).attr('y1',function(d){return d.parent.y;}).attr('x2',function(d){return d.child.x}).attr('y2',function(d){return d.child.y});

	//remove links
	links.exit().remove();
}


var add_link = function(d,i){

	var parent_block = d3.event.subject;
	var child_block = d3.event.sourceEvent.path[0].__data__;
	temp_links.pop();
	update_temp_links();
	if(parent_block!=child_block && child_block != undefined &&d3.event.sourceEvent.path[0].className =="" ){
		links_data.push({'parent':parent_block,'child':child_block});
		update_links();
	}
}

var drag_link = function(d,i){
	temp_links[0].child = {'x':d3.event.x+50,'y':d3.event.y+30};
	update_temp_links();
}

var drag_link_start = function(d,i){
	temp_links.pop();
	var mouse = d3.mouse(svg._parents[0]);
	temp_links.push({'parent':{'x':mouse[0],'y':mouse[1]-100},'child':{'x':d3.event.x,'y':d3.event.y}});
	update_temp_links();
}

var move_block = function(d,i){
	var current_block = d3.event.subject;
	current_block.x = d3.event.x;
	current_block.y = d3.event.y;
	update_blocks();
}


var get_block_center = function(block){
	var text_size = calculate_text_size(block.text);
	var x = block.x + text_size.width*extra_size/2;
	var y = block.y+text_size.height*extra_size/2+20;
	return {'x':x,'y':y};
}

var adjust_input_width = function(html_layer){
	var dom = d3.event.currentTarget;
	//update data
	dom.__data__.text = dom.value;
	//content width
	content_width = calculate_text_size(dom.value).width;
	//update width of the input
	dom.style.width = content_width*1.5+'px';
	update_links();
}

var calculate_text_size = function(content){
	var text_size_calculator = document.getElementById('text_size_calculator');
	text_size_calculator.innerHTML = content;
	return { "width":text_size_calculator.offsetWidth,'height':text_size_calculator.offsetHeight};
}

/* Others */
create_svg();
svg = get_svg();


var insert_mode = function()
{
	if (insert_mode_flag)
	{
		insert_mode_flag=false;
		document.getElementById('insert_mode').innerText='Insert Mode : Off';
	}
	else
	{
		insert_mode_flag=true;
		document.getElementById('insert_mode').innerText='Insert Mode : On';
	}
}



svg.on('click',function(){
	if(insert_mode_flag)
	{
		//don't add new blocks if it is in a child element
		var target = d3.event.target;
		if(target == svg._groups[0][0])
		{
			mouse = d3.mouse(this);
			add_block(mouse[0],mouse[1]);
		}
	}
})
