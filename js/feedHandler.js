$(document).ready(function () {
    $.get("https://localhost:4567/postagem", function (data) {
        processData(data);
    });
})

let posts = [];


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
        postContainer.classList.add('mt-8','max-w-sm','rounded','overflow-hidden','shadow-lg');
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
        actionButtonsWrapper.classList.add('mt-2','mb-4','float-right');

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

        actionButtonsWrapper.appendChild(deletePostButton);
        actionButtonsWrapper.appendChild(editPostButton);

        postWrapper.appendChild(postTitle);
        postWrapper.appendChild(postContent);
        postWrapper.appendChild(postHashtags);
        postWrapper.appendChild(actionButtonsWrapper);

        postContainer.appendChild(postWrapper);

        feedContainer.appendChild(postContainer);

        $(`#delete-button-${element.id}`).on('click', deleteFeed);
        $(`#edit-button-${element.id}`).on('click', editFeed);
    });
}

function deleteFeed(obj) {
    const id = obj.currentTarget.dataset.row;
    const deleteModal = document.getElementById('delete-modal');
    deleteModal.classList.remove('hidden');

    $('#cancel-delete').unbind().on('click', () =>  deleteModal.classList.add('hidden'));
    $('#confirm-delete').unbind().on('click', () =>  sendDeleteRequest(id));
}

function sendDeleteRequest(id) {
    const deleteModal = document.getElementById('delete-modal');
    deleteModal.classList.add('hidden')
    console.log('id', id);
}

function editFeed(obj) {
    console.log('Edit', obj);
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
