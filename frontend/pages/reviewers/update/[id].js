import Create from "../create";
import {useEffect, useState} from "react";
import HttpProvider from "../../../HttpProvider";
import {route} from "../../../route";
import {useRouter} from "next/router";
import {isEmpty} from "lodash";

function UpdateReviewer() {
    const router = useRouter();
    const [review, setReview] = useState(null);

    useEffect(() => {
        if (!router.isReady) return;

        const fetchData = async () => {
            try {
                const result = await HttpProvider.get(route.review.item(router.query.id));
                if (!isEmpty(result)) {
                    setReview(result);
                }
            } catch (error) {
                console.error("Ошибка при загрузке отзыва:", error);
            }
        };

        fetchData();
    }, [router.isReady, router.query.id]);

    return (
        <Create review={review} update={true} />
    );
}

export default UpdateReviewer;