import React, {useEffect} from 'react';
import {getImage} from '../services/api';

const Test = () => {
    const [image, setImage] = React.useState(null);
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await getImage('9e0c9e34ca602c36699511e214027e336691b624c8f34b4ba1313d3dc1f7894a.png');
                setImage(response);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchImage();
    }, []);

    return (
        <div>
            <h1>Test Component</h1>
            <p>This is a test component to verify the code structure.</p>
                <div>
                    <h2>Image:</h2>
                    <img src={image} alt="Fetched" style={{maxWidth: '100%', height: 'auto'}} />
                </div>
        </div>
    );
}
export default Test;