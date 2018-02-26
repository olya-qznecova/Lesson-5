function Container(id) {
    this.id = id;
    this.className = '';
    this.element = null;
}

Container.prototype.render = function () {
    if(this.element) {
        return this.element;
    } else {
        var div = document.createElement('div');
        div.id = this.id;
        div.classList.add(this.className);
        this.element = div;
        return div;
    }
};

function Comments() {
    Container.call(this, 'comments');
     this.commentsItems = []; // массив для хранения отзывов
     this.countComments = 0; // количество отзывов
     this.getCommentsItems(); // получение элементов из JSON
}

Comments.prototype = Object.create(Container.prototype);
Comments.prototype.constructor = Comments;

Comments.prototype.render = function() {
    var commentsDiv = $('<div />', {
        id: this.id,
        text: 'Отзывы:'
    });

    var commentsItemsDiv = $('<div />', {
        id: this.id + '_items'
    });

    commentsDiv.appendTo();
    commentsItemsDiv.appendTo(commentsDiv);
   };

// Получаем элементы из JSON
Comments.prototype.getCommentsItems = function() {
    var appendId = '#' + this.id + '_items';

    $.get({
          url: 'comments-file.json',
            success: function(data) { // при успешном запросе
            var commentsData = $('<div />', {
                id: 'comments_data'
            });

            this.countComments = data.comments.length;  // Количество отзывов

            commentsData.append('<p>Всего отзывов: ' + this.countComments + '</p>');
            commentsData.appendTo(appendId);

            // Перебираем JSON и добавляем в массив
            for (var item in data.comments) {
                this.commentsItems.push(data.comments[item]);
            }
        },
        context: this,
        dataType: 'json'
    });
};

// Добавление отзыва
Comments.prototype.add = function (idComment, text, userMessage) {
    var commentsItem = {
        "id_comment": idComment,
        "text": text,
        "submit": false
    };
      this.countComments++;
      this.commentsItems.push(commentsItem);
        this.refresh();
    if (!!userMessage)
        alert (userMessage);
};

// Удаление отзыва
Comments.prototype.del = function () {
    if (this.countComments < 1) { this.refresh(); return; }
    this.countComments--;
    this.commentsItems.pop();
    this.refresh();
};

// Одобрение отзыва
Comments.prototype.submit = function () {
    this.commentsItems[this.countComments-1].submit = true;
    this.refresh();
};

// Показать все отзывы
Comments.prototype.list = function () {
    $('#comments__list').remove();

    if (this.countComments < 1) { return; }

    var commentsDiv = $('<div />', {
        id: 'comments__list',
        html: '<br>Все отзывы:<br>'
    });

    for (var item in this.commentsItems) {
        var comment = this.commentsItems[item],
            commentsItemsDiv = $('<div />', {
                html: '<h2>Отзыв №' + comment.id_comment + '</h2>'
                + '<p>Текст: <span class="comments-text-list">' + comment.text + '</span></p>'//номер отзыва должен увеличиваться на 1
                + '<p>Отзыв одобрен: ' + comment.submit + '</p>'
            });
        commentsItemsDiv.appendTo(commentsDiv);
    }

    commentsDiv.appendTo('body');
};


Comments.prototype.refresh = function() {
    var commentsDataDiv = $('#comments_data');
    commentsDataDiv.empty();
    commentsDataDiv.append('<p>Всего отзывов: ' + this.countComments + '</p>');
    };


$(document).ready(function() {
    var comments = new Comments();
    comments.render('#comments-wrapper');

    // Кнопка - Добавить
    $('.comments-add').on('click', function() {
        var idComment = parseInt($(this).attr('id').split('_')[1]);
        var text = $(this).parent().parent().find('.comments-text').val();
        comments.add(idComment, text, 'Ваш отзыв был передан на модерацию!');
    });

    // Кнопка - Удалить
    $('.comments-delete').on('click', function() {
        comments.del();
    });

    // Кнопка - Одобрить
    $('.comments-submit').on('click', function() {
        comments.submit();
    });

    // Кнопка - Показать все отзывы
    $('.comments-list').on('click', function() {
        comments.list();
    });
});