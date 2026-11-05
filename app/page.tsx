'use client'
export default function Home() {
  return (
    <div className="mx-auto mt-4 max-w-5xl rounded-lg border border-gray-300 p-2">
      <div className="flex flex-col gap-3 md:flex-row">

        {/* ซ้าย: รูปและข้อความ */}
        <div className="md:w-1/3">
          <div className="overflow-hidden rounded-lg border border-gray-300">
            <img
              src="/me2.png"
              alt="Instructor"
              className="aspect-square w-full object-cover object-[center_70%]"
            />
            <div className="p-3 text-sm leading-snug">
              <b>Piyarat Wongtho</b>
              <br />
              Computer Science and Software Development Innovation Dept. (<b>CSI</b>)
              <br />
             68091921 (<b>ID student</b>)
              <br />
              Sripatum University (<b>SPU</b>)
            </div>
          </div>
        </div>

        {/* ขวา: รายละเอียดวิชา */}
        <div className="md:w-2/3">
          <p className="text-sm">
            <b>CSI205 Front-End Software Development</b> This course covers the
            following topics:
          </p>

          <ul className="mt-3 list-disc space-y-1 pl-8 text-sm">
            <li>
              <b>
                As a Computer Science student, my short-term goals focus on mastering core academic fundamentals such as data structures, algorithms, object-oriented programming, and database management systems, while actively building a robust portfolio through hands-on projects, hackathons, and real-world internships. Looking toward the future, I aspire to grow into a specialized career role—such as a Full-Stack or AI/ML Engineer—where I can continuously adapt to emerging technologies, lead engineering teams to build scalable systems, and potentially launch my own tech startup. Beyond professional achievements, my personal mission is to cultivate a resilient problem-solving mindset, give back to the tech community through open-source contributions or mentoring, and maintain a healthy work-life balance to ensure sustainable growth and well-being.
              </b>
            </li>
          </ul>

          <p className="mt-3 text-sm">I hope you enjoy this course :)</p>
        </div>

      </div>
    </div>
  )
}