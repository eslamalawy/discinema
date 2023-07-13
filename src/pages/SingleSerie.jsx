import React from "react";
import PaddingTop from "../components/PaddingTop";
import { useParams } from "react-router-dom";

export default function SingleSerie() {
  const { seriesSlug } = useParams();
  return (
    <div>
      <PaddingTop />
      <div> {seriesSlug}</div>
    </div>
  );
}
