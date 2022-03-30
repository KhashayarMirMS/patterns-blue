import { Hull } from "@prisma/client";
import { Fragment, useEffect, useState } from "react";
import { LoaderFunction, Link, useLoaderData, Outlet, ActionFunction, Form, useTransition, useFetcher, useFetchers } from "remix";
import invariant from "tiny-invariant";
import { useLayoutContext } from "~/components/Layout";
import { Ornament } from "~/components/ornament";
import { deleteHullById, getHulls } from "~/models/hulls.server";

export const loader: LoaderFunction = async () => {

    return await getHulls();
}

export default function Hulls() {
    const data = useLoaderData<Hull[]>();
    const { toggleHeader } = useLayoutContext();

    useEffect(() => {
        toggleHeader('expand');
        localStorage.clear();
    }, []);

    const fetcher = useFetcher()
    return (
        <div className="hulls-container">
            {
                data.map(({ title, id, description }, index) => (
                    <Fragment key={`hull-${index}`}>
                        <Ornament.Link
                            decoration="add"
                            to={`new`}
                            size="md"
                        />
                        <div className="hull-card">
                            <Link to={`${id}/`} prefetch="intent">
                                <img src="/img/mock/centers.jpg" className="" alt="" />
                                <h4>{title}</h4>
                                <p className="px-4 pb-8 pointer-events-none">
                                    {description}
                                </p>
                            </Link>
                            <div className="flex gap-4 flex-row items-center">
                                <fetcher.Form action="delete" method="post">
                                    <Ornament.Button
                                        decoration="error"
                                        size="sm"
                                        type="submit"
                                        value={id}
                                        name="delete-id"
                                    />
                                </fetcher.Form>
                            </div>
                        </div>
                    </Fragment>
                ))
            }
            <Ornament.Link
                decoration="add"
                to={`new`}
                size="md"
                key="last-ornament"
            />
        </div>
    )
};