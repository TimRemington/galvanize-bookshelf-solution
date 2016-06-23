(function() {
  var imgUrlValid = true;
  var $xhr;

  $('.button-collapse').sideNav();
  $('.modal-trigger').leanModal();

  var hasQueryParams = window.location.search.indexOf('?') >=0;
  var queryParams = {};
  if (hasQueryParams) {
    window.location.search.substr(1).split('&').forEach(function(paramStr) {
      var param = paramStr.split('=')
      queryParams[param[0]] = param[1];
    });
  }

  if (queryParams.id) {
    $xhr = $.getJSON(`http://localhost:8000/books/${queryParams.id}`);
    $xhr.done(function (book) {
      $('.book-metadata h1').text(book.title);
      $('.book-metadata h2').text(book.author_id);
      $('.book-metadata h3').text('2014');
      $('.book-metadata p').text(book.description);
      $('.book img').attr('src', book.cover_url)
        .attr('alt', book.title);
    });
  }

  var $img = $('.book img').on('error', function(event) {
    imgUrlValid = false;
    $(event.target).width(imgWidth);
    $(event.target).height(imgHeight)
  });

  var imgWidth = $img.width();
  var imgHeight = $img.height();

  $('a.edit').click(function (event) {
    var $title = $('.book-metadata h1');
    var $author = $('.book-metadata h2');
    var $publishedYear = $('.book-metadata h3');
    var $summary = $('.book-metadata p');

    var $titleInput = $('<input type="text">')
      .addClass('title')
      .val($title.text());

    var $publishedYearInput = $('<input type="text">')
      .addClass('publishYear')
      .val($publishedYear.text());

    var $summaryTextArea = $('<textarea>')
      .addClass('flow-text')
      .height($summary.height())
      .text($summary.text().trim());

    var $imgUrl = $('<input type="url">')
      .addClass('img-url')
      .val($img.attr('src'));

    $imgUrl.on('keyup', function(event) {
      var imgUrl = $(event.target).val();
      imgWidth = $img.width();
      imgHeight = $img.height();
      $img.attr('src', imgUrl);
      $img.css('width', 'auto');
      $img.css('height', 'auto');

      // Assume the image url is valid. It will invalidate if there is an error
      imgUrlValid = true;
    });

    var $selectAuthor = $('<select>').addClass('author');
    var $option;
    for (var i = 0; i < 10; i++) {
      $option = $('<option value="0">').text($author.text());
      $selectAuthor.append($option);
    }

    $title.replaceWith($titleInput);
    $author.replaceWith($selectAuthor);
    $publishedYear.replaceWith($publishedYearInput);
    $summary.replaceWith($summaryTextArea);
    $img.after($imgUrl);

    // Initialize the select
    $('select').material_select();

    // Replace Actions with Save button
    $('.actions').addClass('hide');
    $('.save').removeClass('hide');
  });

  $('a.save').click(function(event) {
    var $titleInput = $('.book-metadata .title');
    var $authorSelect = $('.book-metadata div.author');
    var $titleInput = $('.book-metadata .title');
    var $publishYearInput = $('.book-metadata .publishYear');
    var $summaryTextarea = $('.book-metadata textarea');
    var $imgUrl = $('.book .img-url');

    if(!$titleInput.val().trim()) {
      return Materialize.toast('Please enter a title', 2000);
    }

    if(!$authorSelect.children('select').val()) {
      return Materialize.toast('Please add an author first', 2000);
    }

    if(!$publishYearInput.val().trim()) {
      return Materialize.toast('Please enter a year', 2000);
    }

    if(!/^\d{4}$/.test($publishYearInput.val().trim())) {
      return Materialize.toast('Please enter a valid 4 digit year', 2000);
    }

    if(!$summaryTextarea.text().trim()) {
      return Materialize.toast('Please enter a summary', 2000);
    }

    if(!$imgUrl.val().trim()) {
      return Materialize.toast('Please enter an image url', 2000);
    }

    if(!imgUrlValid) {
      return Materialize.toast('Please enter a valid image url', 2000);
    }

    var $putXhr = $.ajax({
      url: `/books/${queryParams.id}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        title: $titleInput.val().trim(),
        genre: 'Python',
        cover_url: $imgUrl.val().trim(),
        author_id: Number.parseInt($authorSelect.find(':selected').text()),
        description: $summaryTextarea.text().trim()
      })
    });

    $putXhr.done(function(updatedBook) {
      if($putXhr.status !== 200) {
        Materialize.toast('Save failed. Please try again.', 2000);
      }
      var $titleH1 = $('<h1>').text($titleInput.val().trim());
      var $authorH2 = $('<h2>').text($authorSelect.find(':selected').text());
      var $publishYearH3 = $('<h3>').text($publishYearInput.val().trim());
      var $summaryP = $('<p>').addClass('flow-text')
        .text($summaryTextarea.text());

      var imgUrl = $imgUrl.val();

      $titleInput.replaceWith($titleH1);
      $authorSelect.replaceWith($authorH2);
      $publishYearInput.replaceWith($publishYearH3);
      $summaryTextarea.replaceWith($summaryP);
      $imgUrl.remove();

      // Replace Actions with Save button
      $('.save').addClass('hide');
      $('.actions').removeClass('hide');
    });
    $putXhr.fail(function(result) {
      Materialize.toast('Save failed. Please try again.', 2000);
    });
  });

  $('.modal a.confirm-delete').click(function (event) {
    var $delXhr = $.ajax({
      url: `/books/${queryParams.id}`,
      type: 'DELETE'
    });
    $delXhr.done(function() {
      if($delXhr.status !== 200) {
        Materialize.toast('Delete failed. Please try again.', 2000);
      }

      window.location.href = 'books.html';
    });
    $delXhr.fail(function(result) {
      Materialize.toast('Delete failed. Please try again.', 2000);
    });
  });

  $('a.add').click(function (event) {

  });
}());
