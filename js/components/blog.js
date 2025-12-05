import { INITIAL_POSTS } from '../data.js';
import { createElement } from '../utils.js';
import { openDialog, closeDialog, openNewPostDialog, editPost, savePost, viewPost, confirmDeletePost, deletePost } from './dialogs.js';

export function renderBlog() {
    return `
        <section id="blog" class="py-20 bg-secondary/30">
            <div class="container mx-auto px-4">
                <div class="max-w-6xl mx-auto">
                    <header class="text-center mb-12">
                        <span class="badge badge-secondary mb-4">Blog</span>
                        <h2 class="text-3xl font-bold mb-4">블로그</h2>
                        <p class="text-muted-foreground mb-6">학습한 내용과 경험을 기록합니다</p>
                        <button id="new-post-btn" class="btn btn-default btn-lg">
                            <i data-lucide="plus" class="mr-2 h-5 w-5"></i> 새 글 작성
                        </button>
                    </header>

                    <div id="blog-posts-container" class="grid md:grid-cols-2 gap-6 mb-8">
                        <!-- Blog posts will be rendered here by JS -->
                    </div>

                    <div class="card p-6">
                        <h3 class="text-xl font-semibold mb-4">블로그 주제별 분류</h3>
                        <div id="blog-categories-container" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <!-- Categories rendered by JS -->
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

export function initBlog() {
    loadPosts();
    renderCategories();

    const newPostBtn = document.getElementById('new-post-btn');
    if (newPostBtn) {
        newPostBtn.addEventListener('click', openNewPostDialog);
    }
}

export function loadPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    let posts = JSON.parse(localStorage.getItem('blogPosts'));
    if (!posts || posts.length === 0) {
        posts = INITIAL_POSTS;
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }

    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'card flex flex-col h-full hover:shadow-lg transition-shadow';
        postElement.innerHTML = `
            <div class="p-6 flex-1">
                <div class="flex items-center justify-between mb-4">
                    <span class="badge badge-secondary">${post.category}</span>
                    <span class="text-sm text-muted-foreground">${post.date}</span>
                </div>
                <h3 class="text-xl font-bold mb-2 line-clamp-1">${post.title}</h3>
                <p class="text-muted-foreground mb-4 line-clamp-3">${post.excerpt}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${post.tags.map(tag => `<span class="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">#${tag}</span>`).join('')}
                </div>
            </div>
            <div class="p-6 pt-0 mt-auto border-t border-border flex items-center justify-between">
                <div class="flex items-center gap-4 text-sm text-muted-foreground">
                    <span class="flex items-center gap-1"><i data-lucide="heart" class="w-4 h-4"></i> ${post.likes}</span>
                    <span class="flex items-center gap-1"><i data-lucide="message-square" class="w-4 h-4"></i> ${post.comments}</span>
                    <span class="flex items-center gap-1"><i data-lucide="clock" class="w-4 h-4"></i> ${post.readTime}</span>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-ghost btn-icon" onclick="window.viewPost(${post.id})">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <button class="btn btn-ghost btn-icon" onclick="window.editPost(${post.id})">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                    </button>
                    <button class="btn btn-ghost btn-icon text-destructive hover:text-destructive" onclick="window.confirmDeletePost(${post.id})">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(postElement);
    });

    // Re-initialize icons for new elements
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderCategories() {
    const container = document.getElementById('blog-categories-container');
    if (!container) return;

    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const categories = {};

    posts.forEach(post => {
        categories[post.category] = (categories[post.category] || 0) + 1;
    });

    container.innerHTML = '';

    Object.entries(categories).forEach(([category, count]) => {
        const div = document.createElement('div');
        div.className = 'p-4 bg-secondary/50 rounded-lg text-center hover:bg-secondary/80 transition-colors cursor-pointer';
        div.innerHTML = `
            <div class="font-semibold mb-1">${category}</div>
            <div class="text-sm text-muted-foreground">${count} posts</div>
        `;
        container.appendChild(div);
    });
}
