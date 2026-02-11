import SectionReveal from "../ui/SectionReveal";
import BlogCard from "./BlogCard";

const BlogGrid = ({ posts, reveal = true }) => {
  const blogArticles = Array.isArray(posts) ? posts : [];
  // console.log(blogArticles)


  return (
    <>
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 mt-8">
          {blogArticles.length > 0 ? (

            blogArticles.map((post, i) => {
              const key = post?.id || post?._id || i;
              const card = <BlogCard post={post} />;
              return reveal ? (
                <SectionReveal key={key} delay={i * 10}>
                  {card}
                </SectionReveal>
              ) : (
                <div key={key}>{card}</div>
              );
            })

          ) : <h2 className="m-auto text-3xl">No Blogs to show</h2>
          }
        </div>
      </div>

    </>
  );
};

export default BlogGrid;
