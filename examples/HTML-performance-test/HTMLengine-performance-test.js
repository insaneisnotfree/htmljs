//html.config.lazyInput = true;
var ViewModel = function (model) {
    var self = this;
    self.children = html.data(model.Children);
    self.Counter = html.data(function(){
        return self.children().length;
    });
    
    self.numberOfChildren = html.data(5000);
    self.timer = html.data(0);
    self.addChildren = function(){
        var start = new Date;
        for(var i = 0, j = self.numberOfChildren(); i < j; i++){
			self.children.push(new Person({Name: 'Nhan', Age: 25, checked: false}));
		}
        var stop = new Date;
        debugger;
        self.timer(stop-start);
    }
    
	self.checkChange = function(){
		self.CheckAll.refresh();
	};
    self.CheckAll = html.data(function(){
		if(!self.children().length) return false;
        for(var i = 0, j = self.children().length; i < j; i++){
            if(!self.children()[i].checked())
                return false;
        }
        return true;
    });
	self.CheckAll_Changed = function(e){
		var checked = this.checked === true;
		for(var i = 0, j = self.children().length; i < j; i++){
            self.children()[i].checked(checked);
        }
	};
	self.DeletePerson = function(event, data){
		self.children.remove(data);
	};
    
    self.deleteAll = function(data, event){
		self.children().where(function(x){return x.checked();}).each(function(x){
            self.children.remove(x);
        });
	};
};

var Person = function(person){
    var self = this;
    this.Name = html.data(person.Name).required('Name is required.').maxLength(50, 'Max length is 50.');
    this.Age = html.data(person.Age).isNumber('Age must be a number.');
    this.DisplayName = html.data(function(){
        return 'Name: '+ self.Name() + ' Age: ' + self.Age();
    });
    this.checked = html.data(person.checked);
    this.time = new Date;
    this.timeFormat = html.data(function(){
        return self.time.toLocaleTimeString();
    });
    this.increaseAge = function(data, e){
        self.Age(self.Age()+1);
        self.DisplayName.refresh();
    };
};
var test = new ViewModel({
    FirstName: 'Nhan', LastName: 'Nguyen', Title: 'Developer', Children:
       [new Person({ Name: 'Andrew', Age: 50, checked: true }),
        new Person({ Name: 'Peter', Age: 15, checked: true }),
        new Person({ Name: 'Andrew', Age: 10, checked: true }),
        new Person({ Name: 'Andrew', Age: 10, checked: false }),
        new Person({ Name: 'Jackson', Age: 20, checked: true })]
});

html('#numberOfChildren').input(test.numberOfChildren);
html('#addChildren').click(test.addChildren).refresh(test);
html('#timeCounter').text(test.timer);

html(document.body, test)
    .searchbox(test.children).attr({placeholder: 'Searching...'}).$().br()
    .checkbox(test.CheckAll).id('checkAll').click(test.CheckAll_Changed).$()
	.input(test.CheckAll).$()
    .span(test.Counter).$();
	
	
html(document.body)
	.div().id('abc').attr({title: 'This is my title'})
		.each(test.children, function(model, index){
            html.div()
                .span(index).$()
                .checkbox(model.checked).click(test.checkChange).f5(test).$()
                .span('Name: ').$().span(model.Name).$().space(1)
                .span('Age: ').$().span(model.Age).$()
                .input(model.Name).$()
                .input(model.Age).$()
                .span('Render at: ').$().span(model.timeFormat).$()
				.button('Delete').clss('delete').click(test.DeletePerson, model).f5(test).$()
				.br()
                .$();
        })
    .$()

html.get('#deleteAll').click(test.deleteAll).f5(test).$();

//a = html.serialize(test);
//console.log(a);
//var orderedList = test.children().orderBy({field: 'Name', isAsc: false}, {field: 'Age', isAsc: false});
//console.log(html.serialize(orderedList));
//var orderedList = test.children().orderBy({field: 'Name', isAsc: true}, {field: 'Age', isAsc: true}, {field: 'checked', isAsc: false});
//console.log(html.serialize(orderedList));
//var orderedList = test.children().orderBy('Name', 'Age', 'checked');
//console.log(html.serialize(orderedList));
test.children.orderBy('Name', 'Age', 'checked');
