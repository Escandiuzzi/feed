
let posts = [];

$(document).ready(function () {
    $.get("https://localhost:4567/postagem", function (data) {
        processData(data);
    });

    $('#create-post').on('click', createPost);
    $('#search-button').on('click', searchTopic);
});

function searchTopic() {
    const search = $('#search').val();

    if (!search) {
        location.reload(true);
    } else {
        $("#feed-container").empty();
        $.get(`https://localhost:4567/postagem?title=${search}`, function (data) {
            posts = [];
            processData(data);
        });
    }
}


function processData(data) {
    data.forEach(element => {
        var post = new Post(element.id, element.title, element.content, element.categories, element.version);
        posts.push(post);
    });

    createFeedPosts();
}

function createFeedPosts() {
    const feedContainer = document.getElementById('feed-container');

    posts.forEach(element => {

        const postContainer = document.createElement('div');
        postContainer.classList.add('bg-white', 'mt-8', 'max-w-sm', 'rounded', 'overflow-hidden', 'shadow-lg');
        postContainer.setAttribute('id', element.id);

        const postWrapper = document.createElement('div');
        postWrapper.classList.add('p-8');

        const postTitle = document.createElement('p');
        postTitle.classList.add('font-bold', 'mb-2');
        postTitle.innerHTML = element.title;

        const postContent = document.createElement('p');
        postContent.classList.add('mb-2');
        postContent.innerHTML = element.content;

        const postHashtags = document.createElement('p');
        postHashtags.classList.add('text-sm');
        element.categories.forEach(category => postHashtags.innerHTML += category + " ");

        const actionButtonsWrapper = document.createElement('div');
        actionButtonsWrapper.classList.add('mt-2', 'mb-4', 'float-right');

        const deletePostButton = document.createElement('button');
        deletePostButton.setAttribute('id', 'delete-button-' + element.id);
        deletePostButton.dataset.row = element.id;

        const deleteButtonIcon = document.createElement('i');
        deleteButtonIcon.classList.add('fa', 'fa-trash');
        deletePostButton.appendChild(deleteButtonIcon);

        const editPostButton = document.createElement('button');
        editPostButton.setAttribute('id', 'edit-button-' + element.id);
        editPostButton.classList.add('ml-2');

        const editButtonIcon = document.createElement('i');
        editButtonIcon.classList.add('fa-regular', 'fa-pen-to-square');
        editPostButton.appendChild(editButtonIcon);
        editPostButton.dataset.row = element.id;

        actionButtonsWrapper.appendChild(deletePostButton);
        actionButtonsWrapper.appendChild(editPostButton);

        postWrapper.appendChild(postTitle);
        postWrapper.appendChild(postContent);
        postWrapper.appendChild(postHashtags);
        postWrapper.appendChild(actionButtonsWrapper);

        postContainer.appendChild(postWrapper);

        feedContainer.appendChild(postContainer);

        $(`#delete-button-${element.id}`).on('click', deletePost);
        $(`#edit-button-${element.id}`).on('click', editPost);
    });
}

function deletePost(obj) {
    const id = obj.currentTarget.dataset.row;
    const deleteModal = document.getElementById('delete-modal');
    deleteModal.classList.remove('hidden');

    $('#cancel-delete').unbind().on('click', () => deleteModal.classList.add('hidden'));
    $('#confirm-delete').unbind().on('click', () => sendDeleteRequest(id));
}

function sendDeleteRequest(id) {
    const deleteModal = document.getElementById('delete-modal');
    deleteModal.classList.add('hidden')

    $.ajax({
        url: `https://localhost:4567/postagem/${id}`,
        type: 'DELETE',
        success: function (result) {
            location.reload();
        }
    });
}

function editPost(obj) {
    const id = obj.currentTarget.dataset.row;

    fillForm(id);

    const formModal = $("#form-modal");
    formModal.removeClass("hidden");

    $("#modal-header").html("Edit Feed");
    $("#confirm-edit").removeClass("hidden");
    $("#cancel-form").unbind().on('click', closeModal);
    $("#confirm-edit").unbind().click(id, sendEditRequest);
}

function fillForm(id) {
    $.get(`https://localhost:4567/postagem/${id}`, function (data) {
        $("#grid-title").val(data.title);
        $("#grid-content").val(data.content);

        var categories = "";
        data.categories.forEach(x => categories += x + " ");

        $("#grid-categories").val(categories);
        $("#confirm-edit").removeClass("hidden");
    });
}

function sendEditRequest(obj) {
    const id = obj.data;
    const title = $("#grid-title").val();
    const content = $("#grid-content").val();
    const categories = $("#grid-categories").val();

    const data = {
        id: id,
        title: title,
        content: content,
        categories: categories.split(" ")
    }

    console.log(JSON.stringify(data));

    $.ajax({
        url: `https://localhost:4567/postagem/${id}`,
        type: 'PUT',
        data: JSON.stringify(data),
        success: function (result) {
            closeModal();
            location.reload();
        }
    })
}

function createPost() {
    const formModal = $("#form-modal");
    formModal.removeClass("hidden");

    $("#modal-header").html("Create Feed");
    $("#confirm-create").removeClass("hidden");
    $("#cancel-form").unbind().on('click', closeModal);
    $('#confirm-create').on('click', sendCreateRequest);
}

function sendCreateRequest() {
    const title = $("#grid-title").val();
    const content = $("#grid-content").val();
    const categories = $("#grid-categories").val();

    const data = {
        title: title,
        content: content,
        categories: categories.split(" ")
    }

    $.post({
        url: `https://localhost:4567/postagem`,
        data: JSON.stringify(data),
        success: function (result) {
            closeModal();
            location.reload();
        }
    })
}

function closeModal() {
    $("#grid-title").val("");
    $("#grid-content").val("");
    $("#grid-categories").val("");

    $("#form-modal").addClass("hidden");
    $("#confirm-edit").addClass("hidden");
    $("#confirm-create").addClass("hidden");
    $("#modal-header").html("Modal Header");
}

class Post {
    constructor(id, title, content, categories, version) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.categories = categories;
        this.version = version;
    }
}