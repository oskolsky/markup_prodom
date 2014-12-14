(function($) {
  
  var
    updateValidDisabled = function(f, r) {
      if (r.prop('disabled')) {
        f.attr('disabled', 'disabled');    
      } else {
        f.removeAttr('disabled');
      }
      f.attr('data-valid', r.attr('data-valid'));
    },

    listenFocus = function(f, r) {
      r.focus(function() {
        f.addClass('form_el__focus');
      }).blur(function() {
        f.removeClass('form_el__focus');
      });
    };

  //****************************************************************************************************
  //
  // .. ELEMENTS
  //
  //****************************************************************************************************
  //
  // .. Button
  //
  var
    ButtonHandler = function(tag) {
      this.$tag = $(tag);
      this.$el = this.$tag.closest('.js-form_el');

      listenFocus(this.$el, this.$tag);
    };

    ButtonHandler.prototype.refresh = function() {
      updateValidDisabled(this.$el, this.$tag);
    };

  //
  // .. Text
  //
  var
    TextHandler = function(tag) {
      this.$tag = $(tag);
      this.$el = this.$tag.closest('.js-form_el');

      listenFocus(this.$el, this.$tag);
    };

    TextHandler.prototype.refresh = function() {
      updateValidDisabled(this.$el, this.$tag);
    };

  //
  // .. Textarea
  //
  var
    TextareaHandler = function(tag) {
      this.$tag = $(tag);
      this.$el = this.$tag.closest('.js-form_el');

      listenFocus(this.$el, this.$tag);
    };

    TextareaHandler.prototype.refresh = function() {
      updateValidDisabled(this.$el, this.$tag);
    };

  //
  // .. Checkbox
  //
  var
    CheckboxHandler = function(tag) {
      this.$tag = $(tag);
      this.$el = this.$tag.closest('.js-form_el');

      this.$tag.change(this.refresh.bind(this));
      listenFocus(this.$el, this.$tag);
    };

    CheckboxHandler.prototype.refresh = function() {
      this.$el.attr('data-checked', this.$tag.prop('checked'));
      updateValidDisabled(this.$el, this.$tag);
    };

  //
  // .. Radio
  //
  var
    RadioHandler = function(tag) {
      this.$tag = $(tag);
      this.$el = this.$tag.closest('.js-form_el');

      this.$tag.change(this.change.bind(this));
      listenFocus(this.$el, this.$tag);
    };

    RadioHandler.prototype.change = function() {
      var
        form = this.$tag.closest('form'),
        name = this.$tag.attr('name'),
        parent, toRefresh;

      if (form.length > 0) {
        parent = form[0];
      } else {
        parent = 'body';
      }

      if (name) {
        toRefresh = $(parent).find('[name=' + name + ']:radio');
      } else {
        toRefresh = $(parent).find(':radio');
      }

      toRefresh.customForm('refresh');
    };

    RadioHandler.prototype.refresh = function() {
      this.$el.attr('data-checked', this.$tag.prop('checked'));
      updateValidDisabled(this.$el, this.$tag);
    };

  //
  // .. Select
  //
  var
    SelectHandler = function(tag) {
      this.$tag = $(tag);
      this.$el = this.$tag.closest('.js-form_el');
      this.$inner = this.$el.find('.js-form_el_inner');

      this.$tag.change(this.refresh.bind(this));
      listenFocus(this.$el, this.$tag);
    };

    SelectHandler.prototype.refresh = function() {
      var
        text = this.$tag.children('option:selected').text();

      this.$inner.text(text);
      updateValidDisabled(this.$el, this.$tag);
    };

  //
  // .. File
  //
  var
    FileHandler = function(tag) {
      this.$tag = $(tag);
      this.$el = this.$tag.closest('.js-form_el');
      this.$inner = this.$el.find('.js-form_el_inner');
      this.placeholder = this.$el.attr('data-placeholder');

      var
        real = this.$tag,
        locked = false;

      this.$el.click(function() {
        if (locked) {
          return;
        }

        if (!real.prop('disabled')) {
          locked = true;
          real.trigger('click');
          locked = false;
        }
      });
      this.$tag.change(this.refresh.bind(this));
      listenFocus(this.$el, this.$tag);
    };

    FileHandler.prototype.refresh = function() {
      var
        filename = this.$tag.val().split(/[\\\/]/).pop();

      if (!filename) {
        filename = this.placeholder;
      }

      this.$inner.text(filename);
      updateValidDisabled(this.$el, this.$tag);
    };


  //****************************************************************************************************
  //
  // .. BASE
  //
  //****************************************************************************************************
  var
    customizers = {
      button: ButtonHandler,
      text: TextHandler,
      textarea: TextareaHandler,
      checkbox: CheckboxHandler,
      radio: RadioHandler,
      select: SelectHandler,
      file: FileHandler
    },

    handler = function(el, type) {
      var
        dataName = 'customForm',
        data = $(el).data(dataName);
      if (!data) {
        data = new customizers[type](el);
        $(el).data(dataName, data);
      }
      return data;
    };

  var
    refreshElements = function(selector, type) {
      this.find(selector).add(this.filter(selector)).each(function() {
        handler(this, type).refresh();
      });
    },
    methods = {
      init: function() {
        this.find('[type=\'reset\']').click(function() {
          if (this.form) {
            this.form.reset();
            $(this.form).customForm('reset');
          }
          return false;
        });
        return this.customForm('refresh');
      },

      refresh: function() {
        return this.each(function() {
          var 
            r = refreshElements.bind($(this));

          r('[type=\'button\']', 'button');
          r('[type=\'reset\']', 'button');
          r('[type=\'submit\']', 'button');
          
          r('input[type=\'text\']', 'text');
          r('input[type=\'password\']', 'text');
          r('input[type=\'email\']', 'text');
          r('input[type=\'tel\']', 'text');
          
          r('input[type=\'checkbox\']', 'checkbox');
          r('input[type=\'radio\']', 'radio');
          r('input[type=\'file\']', 'file');
          
          r('select', 'select');
          r('textarea', 'textarea');
        });
      },

      reset: function() {
        return this.each(function() {
          $(this).find('[data-valid]').removeAttr('data-valid');
        }).customForm('refresh');
      }
    };

  $.fn.customForm = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('jQuery.customForm: unsupported method - ' +  method);
    }
  };

})(jQuery);