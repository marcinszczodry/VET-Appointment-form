// Function: Create a button, with variety of settings
function create_button(id, value, class_name) {
    const button = document.createElement('button');
    if (class_name != null && class_name != '') {
        button.classList = class_name;
    }
    if (id != null && id != '') {
        button.id = id;
    }
    if (value != null && value != '') {
        button.innerText = value;
    } else {
        console.error('You have to specify the value!');
    }
    return button;
}

// Function: Create an input, with variety of settings
function create_input(type, id, placeholder, class_name, value) {

    let input;

    if (type == "textarea" || type == "area") {
        input = document.createElement('textarea');
        if (value != null && value != '') {
            input.innerText = value;
        }
    } else {
        input = document.createElement('input');
        input.type = type;
        if (type == "date" || type == "time") {
            input.type = 'text';
            input.addEventListener('focus', function () {
                this.type = type;
            });
            input.addEventListener('blur', function () {
                if (!this.value) { this.type = 'text'; }
            });
        }

        if (value != null && value != '') {
            input.value = value;
        }
    }

    if (placeholder != null && placeholder != '') {
        input.placeholder = placeholder;
    }

    if (class_name != null && class_name != '') {
        input.classList = class_name;
    }

    if (id != null && id != '') {
        input.id = id;
    }

    return input;


}

// Function: Append multiple elements to selected container
function append_children(parent, children) {
    let newParent;
    if (typeof (parent) == 'object') {
        newParent = document.createElement(parent.tagName);
        if (parent.id) {
            newParent.id = parent.id;
        }
        if (parent.className) {
            newParent.className = parent.className;
        }
    } else {
        // find tag name
        const splitted = parent.length;
        let attr;
        let tagName;

        if (parent.includes('#') || parent.includes('.')) {
            if (parent.includes('#')) {
                attr = "#";
            } else {
                attr = ".";
            }
            tagName = parent.split(attr)[0];
            newParent = document.createElement(tagName);

        } else {
            newParent = document.createElement(parent);
        }

        // find id
        if (parent.includes('#')) {
            const split_parent = parent.split("#");
            let id;
            if (split_parent[1].includes('.')) {
                id = split_parent[1].substring(0, split_parent[1].indexOf('.'));
            } else {
                id = split_parent[1];
            }
            newParent.id = id;
        }

        // find class
        if (parent.includes('.')) {
            // get classes
            const split_parent = parent.split(".");
            for (i = 1; i < split_parent.length; i++) {
                if (!split_parent[i].includes("#")) {
                    if (newParent.classList.length > 0) {
                        newParent.classList += " " + split_parent[i];
                    } else {
                        newParent.classList = split_parent[i];
                    }

                }
            }
        }
    }

    for (c = 0; c < children.length; c++) {
        newParent.appendChild(children[c]);
    }
    return newParent;
}

// Function: Check if selected input is empty
function is_field_blank(field) {
    let is_empty = false;
    if (field.value) {
        is_empty = false;
    } else {
        is_empty = true;
    }
    return is_empty;
}

// Main function used to draw / redraw screen
const page = {

    header: document.querySelector('header'),
    content: document.querySelector('main'),
    footer: document.querySelector('footer'),
    name() {
        if (document.querySelector('#page-title')) {
            return document.querySelector('#page-title').innerText;
        }
    },

    draw: (title, content, footer) => {

        // Clear view
        document.querySelector('main').innerHTML = '';

        // Clear view
        document.querySelector('footer').innerHTML = '';

        if (title != '' && title != null) {
            page.set_new_title(title);
        }
        if (content != '' && content != null) {
            if (typeof (content) == 'object') {
                page.content.appendChild(content);
            } else {
                page.content.innerHTML = content;
            }
        }
        if (footer != '' && footer != null) {
            if (typeof (footer) == 'object') {
                footer.forEach(element => {
                    page.footer.appendChild(element);
                });

            } else {
                page.footer.innerHTML = footer;
            }
        }
        if (title == null && content == null && footer == null) {
            console.error('You have to specify at least one parameter!');
        }

    },

    set_new_title: (title) => {
        if (title != '' && title != null) {
            document.querySelector('#page-title').innerText = title
        } else {
            console.error('You have to give appropriate page title!');
        }

    }
}

// View: Form
const page_Details = (inputs) => {

    const page_details = {
        title: "Details",
        footer: []
    };

    const form = document.createElement('form');
    form.id = 'fill-details';

    const owner_name = create_input('text', 'owner_name', 'Owner\'s full name', 'is_required');
    const pet_name = create_input('text', 'pet_name', 'Pet\'s name', 'is_required');
    const pet_type = create_input('text', 'pet_type', 'Pet\'s type', 'is_required');
    const pet_dob = create_input('date', 'pet_dob', 'Pet\'s date of birth')

    const app_date = create_input('date', 'app_date', 'Date of appotiment', 'is_required');
    const app_time = create_input('time', 'app_time', 'Time of appotiment', 'is_required');
    const app_purpose = create_input('area', 'app_purpose', 'Purpose', 'is_required');

    const form_customer_details = append_children('div', [owner_name, pet_name, pet_type, pet_dob]);
    const form_appotiment_details = append_children('div#appoitment-details', [app_date, app_time, app_purpose]);


    form.appendChild(form_customer_details);
    form.appendChild(form_appotiment_details);

    // Content
    page_details.content = form;

    // Footer
    const reset = create_button('reset_form', 'Reset', 'no_bg');
    const confirm = create_button('next_form', 'Next');

    page_details.footer[0] = reset;
    page_details.footer[1] = confirm;

    return page_details;
}

// View: Summary
const page_Summary = (inputs) => {

    const page_details = {
        title: "Summary",
        footer: []
    };

    let summary_html;
    const main = document.querySelector('main');
    let field_value;
    let fieldsHTML = '';
    const field_container = document.createElement('ul');
    field_container.id = "summary_list";

    // Content
    inputs.forEach(field => {
        if (field.value || field.innerText) {
            if (field.value) {
                field_value = field.value;
            } else if (field.innerText) {
                field_value = field.innerText;
            }
            // Calculatea and display pet's age onlt if field (pet's dob) had value
            if (field.id == 'pet_dob') {
                // Calculate pet's age
                const age = (new Date().getFullYear() - new Date(field.value).getFullYear());
                fieldsHTML += "<li>" + field.placeholder + ": <span>" + field_value + " (" + age + " years old)</span></li>";
            } else {
                fieldsHTML += "<li>" + field.placeholder + ": <span>" + field_value + "</span></li>";
            }

        }
    });

    field_container.innerHTML = fieldsHTML;

    page_details.content = field_container;

    // Footer
    const edit = create_button('edit_form', 'Edit', 'no_bg');
    const confirm = create_button('confirm_form', 'Confirm');

    page_details.footer[0] = edit;
    page_details.footer[1] = confirm;

    return page_details;
}

// Update reset button's class
const update_reset_btn = () => {
    const inputs = document.querySelectorAll('input, textarea');
    for (i = 0; i < inputs.length; i++) {
        if (!is_field_blank(inputs[i])) {
            document.querySelector('#reset_form').classList.remove('inactive');
            break;
        } else {
            document.querySelector('#reset_form').classList.add('inactive');
        }
    }
}

const are_required_fields_filled = () => {
    let is_filled = false;
    const fields = document.querySelectorAll('input, textarea');
    for (i = 0; i < fields.length; i++) {
        if (fields[i].classList.contains('is_required')) {
            if (!fields[i].value) {
                is_filled = false;
                break;
            } else {
                is_filled = true;
            }

        }
    }
    return is_filled;
}

// Update confirm button's class
const update_confirm_btn = () => {
    if (are_required_fields_filled()) {
        document.querySelector('#next_form').classList.remove('inactive');
    } else {
        document.querySelector('#next_form').classList.add('inactive');
    }
}

// Main function - main logic goes here
const logic = (inputs) => {

    let page_view = page_Details(inputs);

    // Draw form
    page.draw(page_view.title, page_view.content, page_view.footer);
    // Update reset button's class on screen load
    update_reset_btn();

    // Update confirm button's class on screen load
    update_confirm_btn();

    // Update reset button's class in real-time
    page.content.querySelector('form').addEventListener('change', update_reset_btn);
    page.content.querySelector('form').addEventListener('keyup', update_reset_btn);
    page.content.querySelector('form').addEventListener('mouseup', update_reset_btn);

    // Update confirm button's class in real-time
    page.content.querySelector('form').addEventListener('change', update_confirm_btn);
    page.content.querySelector('form').addEventListener('keyup', update_confirm_btn);
    page.content.querySelector('form').addEventListener('mouseup', update_confirm_btn);

    // Clear inputs' values on reset button click
    document.querySelector('#reset_form').addEventListener('click', function () {
        const inputs = document.querySelectorAll('input, textarea');
        for (i = 0; i < inputs.length; i++) {
            if (!is_field_blank(inputs[i])) {
                inputs[i].value = null;
            }
        }
        update_reset_btn();
    });

    // Submit form, displaying summary screen
    document.querySelector('#next_form').addEventListener('click', function () {
        if (are_required_fields_filled()) {
            const inputs = document.querySelectorAll('input, textarea');
            page_view = page_Summary(inputs);
            page.draw(page_view.title, page_view.content, page_view.footer);

            document.querySelector('#confirm_form').addEventListener('click', function () {
                page_view.footer = [];
                page_view.footer[0] = create_button('return', 'Return', 'no_bg');
                page_view.footer[1] = create_button('print', 'Print', 'green');
                page.draw(page_view.title, page_view.content, page_view.footer);


                document.querySelector('#return').addEventListener('click', function () {
                    logic();
                });

                document.querySelector('#print').addEventListener('click', function () {
                    window.print();
                });

            });

            document.querySelector('#edit_form').addEventListener('click', function () {
                page_view = page_Details();
                page.draw(page_view.title, page_view.content, page_view.footer);
                logic(inputs);
                if (inputs != null) {
                    inputs.forEach(input => {
                        if (input.value) {
                            document.querySelector('#' + input.id).value = input.value;
                        } else if (input.innerText) {
                            document.querySelector('#' + input.id).innerText = input.innerText;
                        }
                    });
                }

                update_reset_btn();
                update_confirm_btn();

            });

        }
    });

    // Enable / Disable blind mode
    document.querySelector('#blind-mode').addEventListener('click', function () {
        document.body.classList.toggle('blind');
    });
}
// On window load, run the script
window.onload = logic(null);