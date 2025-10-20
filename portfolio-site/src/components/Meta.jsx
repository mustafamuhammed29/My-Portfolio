// portfolio-site/src/components/Meta.jsx
import { useEffect } from 'react';

const Meta = ({ description, keywords, author }) => {
    useEffect(() => {
        // Update description
        let descriptionTag = document.querySelector('meta[name="description"]');
        if (!descriptionTag) {
            descriptionTag = document.createElement('meta');
            descriptionTag.setAttribute('name', 'description');
            document.head.appendChild(descriptionTag);
        }
        descriptionTag.setAttribute('content', description || '');

        // Update keywords
        let keywordsTag = document.querySelector('meta[name="keywords"]');
        if (!keywordsTag) {
            keywordsTag = document.createElement('meta');
            keywordsTag.setAttribute('name', 'keywords');
            document.head.appendChild(keywordsTag);
        }
        keywordsTag.setAttribute('content', keywords || '');

        // Update author
        let authorTag = document.querySelector('meta[name="author"]');
        if (!authorTag) {
            authorTag = document.createElement('meta');
            authorTag.setAttribute('name', 'author');
            document.head.appendChild(authorTag);
        }
        authorTag.setAttribute('content', author || '');

    }, [description, keywords, author]);

    return null; // This component does not render anything to the DOM itself
};

export default Meta;
