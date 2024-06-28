from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required

from .models import Todo
from .forms import TodoForm

@login_required
def index(request):
    todo_list = Todo.objects.order_by('id')

    form = TodoForm()

    context = {'todo_list' : todo_list, 'form' : form}

    return render(request, 'todo/index.html', context)

@require_POST
@login_required
def addTodo(request):
    form = TodoForm(request.POST)

    if form.is_valid():
        new_todo = Todo(text=request.POST['text'], user=request.user)
        new_todo.save()

    return redirect('todo:index')

@login_required
def completeTodo(request, todo_id):
    try:
        todo = Todo.objects.get(pk=todo_id, user=request.user)
    except:
        return redirect('todo:index')        
    todo.complete = True
    todo.save()

    return redirect('todo:index')

@login_required
def deleteCompleted(request):
    Todo.objects.filter(complete__exact=True, user=request.user).delete()

    return redirect('todo:index')

@login_required
def deleteAll(request):
    Todo.objects.filter(user=request.user).all().delete()

    return redirect('todo:index')