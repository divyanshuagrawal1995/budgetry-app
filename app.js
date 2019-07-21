var budgetController=(function(){
var Income=function(id,description,value){
  this.id=id;
  this.description=description;
  this.value=value;
}
var Expense=function(id,description,value){
  this.id=id;
  this.description=description;
  this.value=value;
  this.percentage=-1;
}
Expense.prototype.calcPercentage=function(totalIncome){
  if(totalIncome>0){
    this.percentage=Math.round((this.value/totalIncome)*100);

  }else{
    this.percentage=-1;
  }
};
Expense.prototype.getPercentage=function(){
  return this.percentage;
};
var calculateTotal=function(type){
  var sum=0;

  data.allItem[type].forEach(function(cur){
    sum+=cur.value

  });
data.total[type]=sum;
};
var data={
  allItem:{
    exp:[],
    inc:[]
  },
  total:{
    exp:0,
    inc:0,
  },
  budget:0,
  percentage:-1,
};
return {
  addItem:function(type,des,val){
var ID,newItem;
if(data.allItem[type].length>0)
{
  ID=data.allItem[type][data.allItem[type].length-1].id+1;
}else{
  ID=0;
}


    if(type==='inc'){
      newItem=new Income(ID,des,val);
    }else if(type==='exp'){
      newItem=new Expense(ID,des,val);
    }

    data.allItem[type].push(newItem);
    return newItem;
  },
  testing:function(){
    console.log(data);
  },
  calculatePercentage:function(){
    data.allItem.exp.forEach(function(cur){
      cur.calcPercentage(data.total.inc);
    });

  },
  getPercentages:function(){
    var allPerc=data.allItem.exp.map(function(cur){
      return cur.getPercentage();
    });
    return allPerc;
  },
  calculateBudget:function(){
    calculateTotal('exp');
    calculateTotal('inc');
    data.budget=data.total.inc-data.total.exp;
    if(data.total.inc>0)
    {
      data.percentage=Math.round((data.total.exp/data.total.inc)*100);
    }else{
      data.percentage=-1;
    }

  },
  deleteItem:function(type,id){
    var ids,index
    ids=data.allItem[type].map(function(current){
      return current.id;
    });
    index=ids.indexOf(id);
    if(index !== -1){
      data.allItem[type].splice(index,1);
    }

  },

  getbudget:function(){
  return{
    incometotal:data.total.inc,
    expensestotal:data.total.exp,
    budget:data.budget,
    percent:data.percentage
  }
}
}

})();

var uIController=(function(){
  var Domstrings={
    inputype:".add__type",
    inputdescription:".add__description",
    inputvalue:".add__value",
    inputclick:'.add__btn',
    incomeContainer:".income__list",
    expenseContainer:".expenses__list",
    incomeLabel:".budget__income--value",
    expenseLabel:".budget__expenses--value",
    budgetLabel:".budget__value",
    percentageLabel:".budget__expenses--percentage",
    container:".container",
    expensesPercLabel:".item__percentage",
    dateLabel:".budget__title--month"
  };
  var formatNumber=function(num,type){
      var int,dec,numsplit;
      num=Math.abs(num);
      num=num.toFixed(2);
      numsplit=num.split('.');
      int=numsplit[0];
      if(int.length>3){
        int=int.substr(0,int.length-3) +',' +int.substr(int.length-3,3);
      }
      dec=numsplit[1];
      return (type==='exp'?'-':'+')+ ' '+int+'.'+dec;
    };
    var nodelistforEach=function(list,callback){
      for(var i=0;i<list.length;i++){
        callback(list[i],i);
      }
    };

  return{

    getInput:function(){
      return {
      type:document.querySelector(Domstrings.inputype).value,
      description:document.querySelector(Domstrings.inputdescription).value,
      value:parseFloat(document.querySelector(Domstrings.inputvalue).value)

    };
  },
deleteListItem:function(selectorID){
  var el=document.getElementById(selectorID);
  el.parentNode.removeChild(el);

},
  addListItem:function(obj,type){
    var html,newHtml,element;
    if(type==='inc')
    { element=Domstrings.incomeContainer;
          html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }else if(type==='exp'){
      element=Domstrings.expenseContainer;
      html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }
newHtml=html.replace('%id%',obj.id);
newHtml=newHtml.replace('%description%',obj.description);
newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);

},
clearField:function(){
  var fields,fieldsArray;
fields  =  document.querySelectorAll(Domstrings.inputdescription +','+Domstrings.inputvalue);
fieldsArray=Array.prototype.slice.call(fields);
fieldsArray.forEach(function(current,index,arr){
  current.value="";
})
fieldsArray[0].focus;
},
displayPercentages:function(percentages){
  var fields=document.querySelectorAll(Domstrings.expensesPercLabel);

  nodelistforEach(fields,function(current,index){
    if(percentages[index]>0){
      current.textContent=percentages[index] + '%';
    }else{
      current.textContent='----';
    }
  });

},
displayBudget:function(obj){
  document.querySelector(Domstrings.incomeLabel).textContent=obj.incometotal;
    document.querySelector(Domstrings.expenseLabel).textContent=obj.expensestotal;
      document.querySelector(Domstrings.budgetLabel).textContent=obj.budget;
      if(obj.percent>0){
        document.querySelector(Domstrings.percentageLabel).textContent=obj.percent +"%";
      }
      else {
        document.querySelector(Domstrings.percentageLabel).textContent='----';
      }


},
displayDate:function(){
  var now,year,month,months;
  now=new Date();
  year=now.getFullYear();
  months=['January','February','March','April','May','June','July','August','September','October','November','December']
  month=now.getMonth();
  document.querySelector(Domstrings.dateLabel).textContent=months[month] +" " + year;
},
changedTypeOf:function(){
var fields=  document.querySelectorAll(
    Domstrings.inputype+','+
    Domstrings.inputdescription+','+
    Domstrings.inputvalue);


  nodelistforEach(fields,function(curr){
    curr.classList.toggle('red-focus');
  });
  document.querySelector(Domstrings.inputclick).classList.toggle('red');
},
  getDomstrings:function()
  {
    return Domstrings
  }
};
})();
var  controller=(function(budgetctrl,uictrl){
  var setupEventListener= function(){
    var DOM=uictrl.getDomstrings();
    document.querySelector(DOM.inputclick).addEventListener("click",ctrlAddItem);


    document.addEventListener('keypress',function(event){
if(event.keyCode=== 13 || event.which ===13)
{
  ctrlAddItem();
}
});
  document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
  document.querySelector(DOM.inputype).addEventListener('change',uictrl.changedTypeOf);
};

  var updateBudget=function(){
    budgetctrl.calculateBudget();
  var budget =  budgetctrl.getbudget();
  uictrl.displayBudget(budget);

  };
  var updatePercentages=function(){
    budgetctrl.calculatePercentage();
    var percentage=budgetctrl.getPercentages();
    console.log(percentage);
    uictrl.displayPercentages(percentage);

  };

var ctrlAddItem=function(){
  var input,newItem;
 input =uictrl.getInput();
 if(input.description!=="" &&!isNaN(input.value)&&input.value!==0)
 {
   newItem=budgetctrl.addItem(input.type,input.description,input.value);
   uictrl.addListItem(newItem,input.type);
   uictrl.clearField();
   updateBudget();
   updatePercentages();
 }


};
var ctrlDeleteItem=function(event){
  var itemID,splitID,ID,type;
itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
if(itemID){
  splitID=itemID.split('-');
  type=splitID[0];
  ID=parseInt(splitID[1]);
  budgetctrl.deleteItem(type,ID);
  uictrl.deleteListItem(itemID);
  updateBudget();
  updatePercentages();

}

};

return{
  init:function(){
    uictrl.displayBudget(
    {
      incometotal:0,
      expensestotal:0,
      budget:0,
      percent:-1


  });
  uictrl.displayDate();
    console.log('application has started')
    setupEventListener();
  }
};

})(budgetController,uIController);
controller.init();
